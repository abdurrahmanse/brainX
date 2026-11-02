---
name: brainx-progress
description: Update docs/PROGRESS.md for one brainX task, but only when real verification evidence exists in this conversation. Edits that one file and recommends the next task.
argument-hint: "[task ID, e.g. P1-T3]"
disable-model-invocation: true
---

Update `docs/PROGRESS.md` for the brainX task `$ARGUMENTS`. The rules are in `AGENTS.md`.

**Edit only `docs/PROGRESS.md`.**

## Steps

1. Read `docs/PROGRESS.md` and the task's entry in `docs/TASKS.md`.
2. Look for verification evidence in this conversation: real command output that shows what ran and what the result was. A claim without output is not evidence.
   - If there is none, **stop**. Do not edit anything. Tell the owner to run `/brainx-verify $ARGUMENTS` first.
3. Check the repo with read-only commands, so the progress file matches the real state and not just the conversation.
4. Edit `docs/PROGRESS.md`:
   - Add or update the task's row in "Task status". Use **Done** only if every acceptance criterion was verified. If any check was not run or needs the owner, use **Partial** and name what is missing.
   - Put the date (from `date +%F`) and what was run in the Evidence column. Never write a result that was not seen.
   - Remove a "Known problems" or "Decisions waiting for approval" item only if this task resolved it, and say how.
   - Record training results only as numbers taken from a real run folder.
   - Update **Current phase** and **Next task** to match `docs/TASKS.md` order.
5. Show the owner the change, and recommend the next task. Do not start it. Stop.

Do not mark a task done because the owner is happy with it; the evidence has to exist.
