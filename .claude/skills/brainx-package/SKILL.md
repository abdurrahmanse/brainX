---
name: brainx-package
description: Run the brainX package check before installing a dependency - why it is needed, existing overlap, compatibility, and approval. Installs nothing until the owner approves.
argument-hint: "[package name, e.g. datasets]"
disable-model-invocation: true
---

Check the package `$ARGUMENTS` before installing it. The rules are in `AGENTS.md` ("Before adding a package").

**This skill installs nothing and edits no project file.** Use the scratchpad folder for any dry run.

## Steps

1. **Is it planned?** Search the package tables in `docs/MODEL.md`, `docs/BACKEND.md`, and `docs/FRONTEND.md`. Report which task introduces it. If it is not listed, or the current task is not the one that introduces it, say so, and stop for the owner's decision.
2. **Why is it needed?** State the concrete feature in the current task that needs it.
3. **Overlap.** Check whether something already installed or already planned solves the same problem. Read the lockfiles and `package.json` / `pyproject.toml` files. Name the alternative and why it is not enough.
4. **Compatibility.** Use authoritative sources only, such as `npm view <pkg> version peerDependencies engines`, the PyPI JSON for `requires_python`, and the versions already pinned in the repo. For a dry run, resolve in the scratchpad folder, not in the repo (for example `uv pip compile` or `pnpm add` in a throwaway project). Do not call something "tested" unless you ran it, and say exactly what you ran.
5. **Report**, in simple Bengali (package names and commands stay in English):
   - Package, exact version, and the task that introduces it.
   - Why it is needed, and the overlap check result.
   - The compatibility evidence, and what was not checked.
   - The exact install command.
   - Files that the install will change (`pyproject.toml`, `uv.lock`, `package.json`, `pnpm-lock.yaml`).
6. Ask: "Should I install this package now?" **Stop and wait.** Install only after a clear yes, and only inside the task that needs it.

If a package is on a "Not used" list in the docs, or would send data outside the machine, say that clearly and do not recommend it without the owner's explicit decision.
