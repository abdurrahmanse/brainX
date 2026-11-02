---
name: brainx-train
description: Prepare a brainX model training run without starting it. Use for smoke or full training preparation; check prerequisites, hardware, data, estimates, and the exact command.
---

Follow the training rules in `AGENTS.md` and the relevant sections of `docs/MODEL.md`.

- Confirm model, data, tokenizer, loop, checkpoint, and smoke-test prerequisites from the repository.
- Check hardware, free disk, and available generation/training device with read-only commands.
- Report config values and label every time, memory, and disk value as an estimate unless measured from a real comparable run.
- Confirm resume behavior, output location, and git-ignore protection.
- Provide the exact run and resume commands, then stop. Never start `train.py` unless the owner separately approves that specific run.
