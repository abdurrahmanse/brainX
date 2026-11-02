---
name: brainx-verify
description: Verify one completed brainX task using its documented real commands and acceptance criteria. Use after implementation; never fix failures or update progress.
---

Follow `AGENTS.md` and use the task ID in the request. Read the task and its detailed specification before acting.

- Run only its documented verification commands from the repository root.
- Do not install packages, edit files, or start a long training run to make a check pass.
- Report every command as pass, fail, not run, or needs owner, with real output.
- Check `git status --short` and `git diff --stat`; identify files outside the approved scope.
- Judge each acceptance condition as met, not met, or not checked. Do not update `docs/PROGRESS.md`.
