#!/usr/bin/env python3
"""brainX PreToolUse hook for the Bash tool.

Makes Claude Code ask the owner before risky commands (see AGENTS.md):
git commit / push, package installs, file deletion, model training, and
staging model/data, model/checkpoints, model/outputs.

A match prints an "ask" decision. Anything else prints nothing and exits 0.
Matching command text is a safety net, not a security boundary: a command
written in an unusual way can slip past it.
"""
import json
import os
import re
import shlex
import sys

PROTECTED = ("model/data", "model/checkpoints", "model/outputs")
WRAPPERS = {"sudo", "env", "command", "time", "nohup", "nice", "exec", "caffeinate", "builtin"}
ENV_ASSIGN = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*=")
GIT_VALUE_FLAGS = {"-C", "-c", "--git-dir", "--work-tree", "--namespace"}
UV_VALUE_FLAGS = {"--directory", "--project", "--python", "-p", "--package", "--config-file"}
JS_VALUE_FLAGS = {"--filter", "-F", "--dir", "-C", "--prefix", "--workspace", "--cwd", "--registry", "--reporter", "--config"}
MAX_DEPTH = 3


def split_segments(text):
    """Split a shell command into argv lists at ; && || | and newlines."""
    segments = []
    for line in text.split("\n"):
        try:
            lexer = shlex.shlex(line, posix=True, punctuation_chars=True)
            lexer.whitespace_split = True
            tokens = list(lexer)
        except ValueError:
            tokens = line.split()
        current = []
        for token in tokens:
            if token and set(token) <= set(";&|()"):
                if current:
                    segments.append(current)
                    current = []
            else:
                current.append(token)
        if current:
            segments.append(current)
    return segments


def command_start(segment):
    """Drop leading VAR=value, sudo, env, caffeinate and their flags."""
    i = 0
    after_wrapper = False
    while i < len(segment):
        token = segment[i]
        if ENV_ASSIGN.match(token):
            i += 1
        elif token in WRAPPERS:
            after_wrapper = True
            i += 1
        elif after_wrapper and token.startswith("-"):
            i += 1
        else:
            break
    return segment[i:]


def positional(args, value_flags=()):
    """Arguments that are not flags (and not the values of known flags)."""
    out = []
    i = 0
    while i < len(args):
        arg = args[i]
        if arg == "--":
            out.extend(args[i + 1:])
            break
        if arg in value_flags:
            i += 2
        elif arg.startswith("-"):
            i += 1
        else:
            out.append(arg)
            i += 1
    return out


def git_subcommand(args):
    i = 0
    while i < len(args):
        arg = args[i]
        if arg in GIT_VALUE_FLAGS:
            i += 2
        elif arg.startswith("-"):
            i += 1
        else:
            return arg, args[i + 1:]
    return None, []


def is_protected(path):
    norm = re.sub(r"^(\./)+", "", path).rstrip("/") or "."
    if norm == "model":
        return True
    return any(
        norm == p or norm.startswith(p + "/") or norm.endswith("/" + p) or ("/" + p + "/") in norm
        for p in PROTECTED
    )


def check_git(args):
    sub, rest = git_subcommand(args)
    if sub == "commit":
        return "creates a git commit"
    if sub == "push":
        return "pushes to a remote"
    if sub in ("rm", "clean"):
        return f"deletes files (git {sub})"
    if sub == "add":
        flags = [a for a in rest if a.startswith("-") and a != "--"]
        paths = [re.sub(r"^(\./)+", "", a).rstrip("/") or "." for a in rest if not a.startswith("-")]
        if any(f in ("-A", "--all") for f in flags) or "." in paths or ":/" in paths:
            return "stages everything (AGENTS.md: stage named files only)"
        if any(is_protected(p) for p in rest if not p.startswith("-")):
            return "stages model/data, model/checkpoints, or model/outputs"
    return None


def check_argv(argv, depth):
    if not argv:
        return None
    cmd = os.path.basename(argv[0])
    args = argv[1:]

    if cmd in ("sh", "bash", "zsh") and "-c" in args and depth < MAX_DEPTH:
        j = args.index("-c")
        if j + 1 < len(args):
            return check_text(args[j + 1], depth + 1)

    if cmd == "git":
        return check_git(args)

    if cmd in ("rm", "rmdir", "unlink", "shred"):
        return "deletes files"
    if cmd == "find" and ("-delete" in args or "rm" in [os.path.basename(a) for a in args]):
        return "deletes files (find)"

    if cmd == "uv" or cmd.startswith("python"):
        if any(os.path.basename(a) == "train.py" or a == "src.train" for a in args):
            return "starts model training (needs approval for this specific run)"

    if cmd == "uv":
        pos = positional(args, UV_VALUE_FLAGS)
        if pos and pos[0] in ("add", "sync", "remove"):
            return f"changes installed packages (uv {pos[0]})"
        if len(pos) >= 2 and pos[0] == "pip" and pos[1] == "install":
            return "installs packages (uv pip install)"

    if cmd in ("pip", "pip3"):
        pos = positional(args)
        if pos and pos[0] == "install":
            return "installs packages (pip install)"
    if cmd.startswith("python") and args[:2] == ["-m", "pip"]:
        if "install" in positional(args[2:]):
            return "installs packages (python -m pip install)"

    if cmd in ("npm", "pnpm", "yarn", "bun"):
        pos = positional(args, JS_VALUE_FLAGS)
        if pos:
            sub, packages = pos[0], pos[1:]
            if sub == "add":
                return f"installs packages ({cmd} add)"
            if sub in ("install", "i"):
                if cmd == "npm" or packages:
                    return f"installs packages ({cmd} {sub})"
    return None


def check_text(text, depth=0):
    for segment in split_segments(text):
        reason = check_argv(command_start(segment), depth)
        if reason:
            return reason
    if depth < MAX_DEPTH:
        for match in re.finditer(r"\$\(([^()]*)\)|`([^`]*)`", text):
            inner = match.group(1) or match.group(2) or ""
            reason = check_text(inner, depth + 1)
            if reason:
                return reason
    return None


def main():
    try:
        data = json.load(sys.stdin)
        command = (data.get("tool_input") or {}).get("command", "")
        reason = check_text(command) if isinstance(command, str) else None
    except Exception as error:  # fail toward asking, never toward silence
        reason = f"the guard could not read this command ({type(error).__name__})"
    if reason:
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "ask",
                "permissionDecisionReason": f"brainX guard: this command {reason}. AGENTS.md requires the owner's approval first.",
            }
        }))
    return 0


if __name__ == "__main__":
    sys.exit(main())
