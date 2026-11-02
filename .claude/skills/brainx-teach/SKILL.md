---
name: brainx-teach
description: Explain what was just built for a brainX task, in simple Bengali - what was written, how it works, why this approach, what was learned, and how to test it. Changes no files.
argument-hint: "[task ID, optional]"
disable-model-invocation: true
---

Teach the owner what was built for the brainX task `$ARGUMENTS`. If no ID was given, use the task just completed in this conversation. The rules are in `AGENTS.md`.

**This skill is read-only.** Do not edit any file.

## Steps

1. Read the files that were actually changed (`git status --short`, `git diff`). Base the lesson on them, not on memory.
2. Write the lesson in simple Bengali. Code, filenames, commands, and technical terms stay in English. Keep it short, and give a small example for any hard idea.
3. Use exactly these headings:
   - **কী লেখা হলো:** the files and what each one does.
   - **কীভাবে কাজ করে:** the flow, step by step. Use a tiny example.
   - **কেন এই উপায়:** why this approach was chosen, and one alternative that was not used.
   - **আপনি কী শিখলেন:** two or three key ideas.
   - **নিজে কীভাবে পরীক্ষা করবেন:** exact commands and what output to expect. Only list commands you know exist.
4. Only state results you actually saw in this conversation. If something was not run, say so plainly.
5. Do not start the next task, and do not claim the task is done. Finish by pointing to `/brainx-verify` if verification has not run yet, then stop.
