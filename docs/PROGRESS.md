# brainX: Progress

Update this file only after verification supports it. If the repo disagrees with this file, trust the repo and report the difference.

**Current phase:** Phase 1: Planning & Setup

**Next task:** P1-T3: Check the Turborepo starter builds (needs owner approval)

## Task status

| Task | Status | Evidence |
|---|---|---|
| P1-T1 | Done | Owner confirmed hardware, from-scratch training, features, and the simple plan on 2026-11-02 |
| P1-T2 | Done | Docs written; links, task IDs, and old-file references checked on 2026-11-02 |

All other tasks in [TASKS.md](TASKS.md) have not started.

## Known problems

- **Starter build not confirmed.** In a temporary copy of the repo, `build` and `check-types` failed with `next: command not found`. The cause is unknown, it may come from the copy, and it hasn't been run in the real repo. P1-T3 checks this.

- **`apps/docs` was renamed to `apps/admin` outside the task list.** Its package is still named `docs`, the change is uncommitted, and `pnpm-lock.yaml` still says `apps/docs`, so a frozen install may fail. P1-T3 checks this.

## Decisions waiting for approval

- Whether to keep `apps/admin`, and removing `packages/ui`, the starter READMEs, and the empty `models/` folder (P1-T4).
- Final model size (P2-T2). Size M is only a recommendation.
- Creating the `brainx` and `brainx_test` databases (P5-T3).
- Each package, before it's installed.

## Confirmed on 2026-11-02

- Train from scratch (approach A).
- Dataset plan and ML package plan in `docs/MODEL.md`.
- Backend plan and PostgreSQL in `docs/BACKEND.md`.
- Folders are created by the task that needs them.

## Training results

None yet.
