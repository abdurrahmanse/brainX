---
name: brainx-walkthrough
description: After a brainX task is implemented, guide the student through the changed files in reading order, with what to look for, self-check questions, and a small exercise to try. Read-only.
argument-hint: "[task ID, optional]"
disable-model-invocation: true
---

Guide the owner through reading the work for the brainX task `$ARGUMENTS`. If no ID was given, use the task just completed in this conversation. The rules are in `AGENTS.md`.

The owner is a student who wants to understand every change by reading it. Your job is to help them read and think, not to explain everything for them. (`/brainx-teach` is the one that explains.)

**This skill is read-only.** Do not edit any file. Do not run the exercises yourself.

## Steps

1. List what changed with read-only commands (`git status --short`, `git diff --stat`, and `git diff` for the files involved). Base everything on the real files.
2. Put the files in a sensible reading order: configuration first, then the main code, then the tests that check it.
3. Write the walkthrough in simple Bengali. Code, filenames, commands, and technical terms stay in English. Use these parts:
   - **পড়ার ক্রম:** each file in order, with one line on why to open it and two or three things to look for.
   - **নিজে ভাবুন:** three to five short questions about how it works and why. Do not answer them here.
   - **নিজে চালান:** the exact commands the owner should run themselves, and what output to expect. Only list commands that exist now.
   - **ছোট অনুশীলন:** one safe experiment, such as changing a value and re-running a test to see it fail, then undoing it. Say how to undo it.
   - **উত্তর (আগে নিজে চেষ্টা করুন):** short answers to the questions above, placed last.
4. Only describe what you saw in the files. If something was not run, say so plainly.
5. Do not start the next task. Finish by suggesting `/brainx-verify` if it has not run, or `/brainx-teach` if the owner wants an explanation, then stop.
