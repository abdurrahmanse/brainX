# brainX: Progress

Update this file only after verification supports it. If the repo disagrees with this file, trust the repo and report the difference.

**Current phase:** Phase 1: Planning & Setup

**Next task:** P1-T3: Check the Turborepo starter builds (needs owner approval)

## Task status

| Task | Status | Evidence |
|---|---|---|
| P1-T1 | Done | Owner confirmed hardware, from-scratch training, features, and the simple plan on 2026-11-02 |
| P1-T2 | Done | Docs written; links, task IDs, and old-file references checked on 2026-11-02 |
| Agent system (setup, not a numbered task) | Partial | Seven skills, two subagents, the guard hook, and `docs/GUIDE.md` are written. The guard script passed 103 sample commands when run alone. Nothing has been verified inside Claude Code yet; see Known problems |

All other tasks in [TASKS.md](TASKS.md) have not started.

## Known problems

- **Starter build not confirmed.** In a temporary copy of the repo, `build` and `check-types` failed with `next: command not found`. The cause is unknown, it may come from the copy, and it hasn't been run in the real repo. P1-T3 checks this.

- **`apps/docs` was renamed to `apps/admin` outside the task list.** The rename is committed (`de03224`), and `pnpm-lock.yaml` lists `apps/admin`. Its package is still named `docs`. A frozen install has not been run in the real repo, so P1-T3 checks that it works.

- **Agent system not verified inside Claude Code.** The guard hook did not fire in the session that created it (`git commit -h` ran without a prompt). The skills and subagents have never been run. The owner runs the first-session checks in [GUIDE.md](GUIDE.md) (section 2), then the results are recorded here.

## Decisions waiting for approval

- Whether to keep `apps/admin`, and removing `packages/ui`, the starter READMEs, and the empty `models/` folder (P1-T4).
- Final model size (P2-T2). Size M is only a recommendation.
- Creating the `brainx` and `brainx_test` databases (P5-T3).
- Each package, before it's installed.

## Confirmed on 2026-11-02

- Train from scratch (approach A).
- Dataset plan and ML package plan in `docs/MODEL.md`.
- Backend plan and PostgreSQL in `docs/BACKEND.md`.
- Folders are created by the task that needs them. One approved exception: the owner asked for the `model/` structure up front (committed in `abbf5f1`), so its seven notebooks, six `.py` files, `training.yaml`, and `pyproject.toml` exist as empty placeholders. They get their content only in their own tasks.

## Training results

None yet.
