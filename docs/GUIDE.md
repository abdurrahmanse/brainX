# brainX: Development Guide

This guide explains how to develop brainX with an AI coding agent while keeping the student in control. It complements [DEVELOPMENT.md](DEVELOPMENT.md), which explains the application and development roadmap.

The goal is simple: the agent can help with the work, but you read the plan, approve each task, inspect the change, and run the important checks yourself. The project rules are in [AGENTS.md](../AGENTS.md).

## The task cycle

| Stage | Who does it | What happens |
|---|---|---|
| Explain | Agent | Reads the task, current progress, and repository state; then explains the intended change |
| Approve | You | Confirm the exact task or ask for a change before implementation |
| Implement | Agent | Changes only files in the approved task scope |
| Verify | Agent and you | Runs documented checks and reports real output |
| Learn | You and agent | Read changed files, ask questions, and understand the design |
| Record | Agent | Updates progress only when evidence supports it |
| Commit | You | Review and commit named files when you are ready |

The agent must not silently start the next task. It stops after each task.

## First-time agent-system check

The Claude Code helpers are written but have not been verified inside a real Claude Code session. Run these checks once before relying on them.

### 1. Open a new Claude Code session

Start Claude Code in this repository so it loads `.claude/settings.json` and the local skills. Run `/hooks`; the `Bash` hook should list `brainx_guard.py`.

### 2. Test the guard hook

Ask Claude Code to run `git commit -h`.

- **Expected:** it asks for approval and says that the brainX guard intercepted a commit command.
- **If it does not ask:** the hook is not active. Do not rely on it; report the result in [PROGRESS.md](PROGRESS.md).

### 3. Test task explanation

Run `/brainx-task P1-T4`.

- **Expected:** the agent explains the task, asks “Should I implement this task now?”, and changes no files.
- **Check:** run `git status --short`. A clean result means the explanation step was read-only.

### 4. Test a read-only reviewer

Ask for a documentation review using the `doc-auditor` subagent.

- **Expected:** it reports findings without editing files.
- **Check:** run `git status --short` again. It should still be clean.

When all four checks work, update the related “Agent system not verified” note in [PROGRESS.md](PROGRESS.md) with real evidence.

## Working on one task

1. Start with `/brainx-task <ID>` in Claude Code, or ask the current coding agent to explain the task ID.
2. Read the explanation and compare its files and packages with [TASKS.md](TASKS.md).
3. Give a clear approval only when the scope is correct.
4. While work is in progress, inspect it in another terminal:

   ```bash
   git status --short
   git diff
   ```

5. Run `/brainx-verify <ID>` after implementation. Run the same documented commands yourself when practical.
6. Use `/brainx-walkthrough <ID>` to read the files in a useful order, then `/brainx-teach <ID>` for a short explanation.
7. Use `scope-reviewer` when you want an independent read-only scope check.
8. Use `/brainx-progress <ID>` only after real verification output exists.
9. Review the diff and commit named files only:

   ```bash
   git status --short
   git add <specific-file>
   git commit -m "<clear message>"
   ```

Never use `git add .` or `git add -A` for this project.

## When to stop the agent

Stop and ask questions when the agent:

- Says a check passed without showing real output.
- Attempts a package install, file deletion, training run, commit, or push without the required approval.
- Changes a file outside the approved task scope.
- Starts another task automatically.
- Makes a claim you cannot understand or verify.

## Troubleshooting

| Problem | Safe response |
|---|---|
| A command fails | Copy the complete error, ask for a simple cause explanation, then approve a fix separately. |
| The agent is changing the wrong thing | Say “Stop. Show the changed files and diff.” Then inspect `git diff`. |
| You want to discard a change | Inspect the diff first, then ask for a specific file to be restored. |
| A skill or hook is missing | Start a new Claude Code session, run `/hooks`, and confirm the repository path. |
| A task needs a package | Ask for the package review first; do not install it just because it sounds useful. |

## What each project helper does

| Helper | Purpose |
|---|---|
| `AGENTS.md` | Repository-wide coding and safety rules |
| `docs/TASKS.md` | Ordered task roadmap and acceptance conditions |
| `docs/PROGRESS.md` | Verified progress and known issues |
| `/brainx-task` | Explains one task and waits for approval |
| `/brainx-verify` | Runs the task’s verification commands without editing files |
| `/brainx-walkthrough` | Guides you through reading completed work |
| `/brainx-teach` | Explains completed work in simple terms |
| `/brainx-progress` | Updates progress from real verification evidence |
| `/brainx-package` | Reviews a package before installation |
| `/brainx-train` | Prepares a training run without starting it |
| `scope-reviewer`, `doc-auditor` | Read-only reviewers |
| `brainx_guard.py` | Asks before risky shell commands; it is a safety net, not a security boundary |

## Current next step

The documented next task is `P1-T4: Remove unused starter parts`. It requires a separate yes for each deletion. After the foundation tasks are complete, the model path is: Python workspace → hardware/data/tokenizer → model implementation → smoke training → full training. See [DEVELOPMENT.md](DEVELOPMENT.md#development-roadmap) for the full sequence.
