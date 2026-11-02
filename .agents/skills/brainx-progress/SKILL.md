---
name: brainx-progress
description: Update brainX progress only after a task has real verification evidence in the conversation. Use after successful verification; edit only docs/PROGRESS.md.
---

Follow `AGENTS.md` and use the task ID in the request.

1. Find the task and inspect the repository state with read-only commands.
2. Require real command output for every claimed verification result. If evidence is missing, stop and direct the owner to verification.
3. Edit only `docs/PROGRESS.md`, recording the date, commands, real result, status, remaining gaps, and accurate next task.
4. Show the change and recommend the next task without starting it.
