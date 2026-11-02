"""Deterministic checks for the brainX Claude Code Bash guard.

Run this file directly. It tests command text only; it never executes the
commands listed in the cases.
"""

from brainx_guard import check_text


ASK_CASES = (
    "git commit -m test",
    "git push origin main",
    "git reset --hard",
    "git restore README.md",
    "git checkout -- README.md",
    "rm example.txt",
    "pnpm install",
    "pnpm add zod",
    "pnpm remove zod",
    "npm ci",
    "uv sync",
    "python3 -m src.train",
    "git add model/outputs/example.bin",
)

ALLOW_CASES = (
    "git status --short",
    "git diff --check",
    "git log --oneline -5",
    "pnpm lint",
    "python3 -m json.tool .claude/settings.json",
)


def main() -> None:
    for command in ASK_CASES:
        assert check_text(command), f"Expected approval request: {command}"
    for command in ALLOW_CASES:
        assert check_text(command) is None, f"Expected allow: {command}"
    print(f"PASS: {len(ASK_CASES)} approval cases and {len(ALLOW_CASES)} allow cases.")


if __name__ == "__main__":
    main()
