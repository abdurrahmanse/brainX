---
name: brainx-task
description: Start one brainX task by ID (for example P1-T3). Reads the project rules and progress, checks the repo, explains the task in simple Bengali, then stops and waits for approval.
argument-hint: "[task ID, e.g. P1-T3]"
disable-model-invocation: true
---

Start the brainX task `$ARGUMENTS`.

The rules are in `AGENTS.md`. Follow them, and do not copy or restate them here.

## Steps

1. Read `AGENTS.md`, `CLAUDE.md`, and `docs/PROGRESS.md`.
2. If no task ID was given, use the next incomplete task from `docs/PROGRESS.md`, and say that you did.
3. Find the task in `docs/TASKS.md`, then read its full specification in the file that TASKS.md links to (`docs/MODEL.md`, `docs/BACKEND.md`, or `docs/FRONTEND.md`). Phase 1, 7, and 8 tasks have only a table row, so say so.
4. Check the real repo state with read-only commands. If it contradicts `docs/PROGRESS.md`, report the difference. Never assume a task is done because the progress file says so.
5. Confirm every prerequisite task is really complete. If one is not, stop and say which.
6. Explain the task in simple Bengali (code, filenames, and technical terms stay in English):
   - Task ID and title.
   - What we are building, and why it is needed.
   - Files that will be created or changed.
   - Packages to install, if any, with the reason.
   - How it connects to the project.
   - Expected result and how it will be verified.
7. Ask: "Should I implement this task now?"
8. **Stop.** Make no changes, install nothing, and start nothing, until the owner approves this task.

## After approval

Follow `AGENTS.md`: implement only the approved scope, verify it, teach what was built, update `docs/PROGRESS.md` only if verification supports it, recommend the next task, and stop again.
