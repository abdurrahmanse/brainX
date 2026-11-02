---
name: brainx-train
description: Prepare a brainX training run - checklist, hardware check, estimates labelled as estimates, and the exact command. Never starts the run.
argument-hint: "[run name or purpose, e.g. smoke-test-S]"
disable-model-invocation: true
---

Prepare the training run `$ARGUMENTS`. The rules are in `AGENTS.md` ("Before any training").

**This skill never starts training.** Do not run `train.py`, and do not start any process expected to take over 10 minutes. Preparing means checking, explaining, and giving the owner the command.

## Steps

1. Read `docs/PROGRESS.md`, the training sections of `docs/MODEL.md`, and `model/configs/training.yaml` if it is not empty.
2. **Prerequisites.** Confirm from the repo, not from the progress file alone, that these exist: the confirmed model size (P2-T2), token files and tokenizer (P2-T10), the training loop and checkpoint code (P3-T4, P3-T5), and, for a full run, a successful smoke test (P3-T6). List anything missing and stop if a prerequisite is not done.
3. **Hardware.** Check with read-only commands: chip, RAM (`sysctl`), free disk (`df`), and whether PyTorch sees MPS. Report the real values.
4. **Plan.** State the model size, data, batch, learning rate, and number of steps from the config.
5. **Estimates.** Give training time, disk use, and memory, each clearly labelled **estimate**. Base time on measured speed from a real smoke-test run if one exists. Otherwise say it comes from the random-data benchmark in `docs/MODEL.md`, which may be too optimistic. Do not invent numbers.
6. **Safety.** Confirm that resume works (checkpoint files and the resume command), that the run folder will not overwrite an existing one, and that nothing under `model/data/`, `model/checkpoints/`, or `model/outputs/` will be committed.
7. **Command.** Give the exact command, including `caffeinate -i`, and how to resume it.
8. **Report** in simple Bengali (commands and technical terms stay in English). Then stop. A run starts only when the owner runs the command, or gives explicit approval for this specific run.

After a run, results are reported only from its run folder (`metrics.jsonl`, config, and samples). If a value is missing, say that it is missing.
