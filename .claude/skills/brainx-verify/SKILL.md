---
name: brainx-verify
description: Verify one brainX task by ID. Runs the task's real verification commands and reports each as pass, fail, or not run, with the actual output. Changes no files.
argument-hint: "[task ID, e.g. P2-T4]"
disable-model-invocation: true
---

Verify the brainX task `$ARGUMENTS`. The rules are in `AGENTS.md`; do not restate them here.

**This skill is read-only.** Do not edit any file, install anything, or fix a failure. That includes `docs/PROGRESS.md`.

## Steps

1. If no task ID was given, use the task the owner most recently approved in this conversation. If there is none, ask.
2. Read the task in `docs/TASKS.md` and its full spec (`docs/MODEL.md`, `docs/BACKEND.md`, or `docs/FRONTEND.md`). Collect its acceptance criteria and its Verify (or Testing) steps. Phase 1, 7, and 8 tasks have only a "Done when" condition; use that.
3. Run each verification command exactly as written, from the repo root. Show the real output.
   - If a command needs a package, service, or file that does not exist yet, mark it **not run** and say why. Do not install anything to make it run.
   - Do not start any run that would take over 10 minutes. Mark it **not run** and tell the owner the command.
   - Steps that say "owner reviews" or "check by hand" cannot be run by an agent. Mark them **needs owner** and say exactly what to look at.
4. Check scope with read-only git commands (`git status --short`, `git diff --stat`). List any changed file that is not in the task's Files list.
5. Judge each acceptance criterion as met, not met, or not checked, and give the evidence for each.

## Report

| Command | Result | Key output |
|---|---|---|

Then list:

- Acceptance criteria: met, not met, or not checked, with evidence.
- Files changed outside the task's Files list.
- Anything not run, and why.

Never write "passed" for something you did not run in this session. If a command failed, explain the error in simple Bengali (commands and technical terms stay in English), and stop. Do not fix it without the owner's approval.

Finish by saying whether the evidence supports marking the task done, partial, or not done. Do not update `docs/PROGRESS.md`; that is `/brainx-progress`.
