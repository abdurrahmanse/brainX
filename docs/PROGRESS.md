# brainX: Progress

Update this file only after verification supports it. If the repo disagrees with this file, trust the repo and report the difference.

**Current phase:** Phase 1: Planning & Setup

**Next task:** P1-T4: Remove unused starter parts (needs owner approval; each item is a separate yes)

## Task status

| Task | Status | Evidence |
|---|---|---|
| P1-T1 | Done | Owner confirmed hardware, from-scratch training, features, and the simple plan on 2026-11-02 |
| P1-T2 | Done | Docs written; links, task IDs, and old-file references checked on 2026-11-02 |
| P1-T3 | Done | On 2026-11-02, run in the real repo from the root: `pnpm install --frozen-lockfile` exit 0 (6 workspace projects, already up to date); `pnpm build` exit 0 (`web` and `admin` built with Next.js 16.3.8 and TypeScript 7.0.2, 2 of 2 tasks); `pnpm lint` exit 0 (3 of 3 tasks, `--max-warnings 0`); `pnpm check-types` exit 0 (3 of 3 tasks). No tracked file was changed by the runs. They created untracked `.turbo/` folders, which P1-T5 will ignore |
| P1-T5 | Partial | Done early at the owner's request, before P1-T4. Root `.gitignore` rewritten; `!.env.example` added to `apps/web/.gitignore` and `apps/admin/.gitignore`; `.DS_Store` and `.turbo/preferences/tui.json` untracked with `git rm --cached` (committed in `12dcd93`; both files are still on disk). `git check-ignore` confirmed 34 paths ignored and 21 required paths not ignored. **Not done:** renaming the root package from `my-turborepo` to `brainx` (spec step 3), and re-running `pnpm build` after it |
| UI foundation (early, owner's request) | Partial | On 2026-11-02: six UI packages installed (see [FRONTEND.md](FRONTEND.md#ui-foundation-done-early-2026-11-02)), a shared design system built in `packages/ui`, and `web` and `admin` rebuilt on it. `pnpm check-types`, `pnpm lint`, and `pnpm build` passed; `turbo boundaries` found no issues; a second `pnpm build` was fully cached (13 ms). Screenshots of both apps matched DESIGN.md in light, dark, and a true 390px width. **Not checked:** clicking the theme toggle, mobile menu, and toast in a browser; `pnpm dev` hot reload |
| Agent system (setup, not a numbered task) | Partial | Seven skills, two subagents, the guard hook, and `docs/GUIDE.md` are written. The guard script passed 103 sample commands when run alone. Nothing has been verified inside Claude Code yet; see Known problems |

All other tasks in [TASKS.md](TASKS.md) have not started.

## Known problems

- **An earlier failure is unexplained.** In a temporary copy of the repo, `build` and `check-types` failed with `next: command not found`. The same commands pass in the real repo (P1-T3), so the copy is the likely cause, but the exact cause was never found.

- **`apps/docs` was renamed to `apps/admin` outside the task list.** The rename is committed (`de03224`) and `pnpm-lock.yaml` lists `apps/admin`. The owner has since changed the package name from `docs` to `admin` in `apps/admin/package.json`; that change is committed (`8557f2b`). A frozen install, build, lint, and type-check all passed with it (P1-T3).

- **Running dev servers need a restart.** The `web` and `admin` dev servers were started before the Tailwind and PostCSS files existed. Stop them and run `pnpm dev` again to see the new UI. (The screenshots used separate production servers on ports 3100 and 3101, which are stopped.)

- **Unused starter leftovers.** `packages/ui/src/code.tsx`, the starter images in each app's `public/`, and the duplicate Geist font files in each app are still there. P1-T4 asks before removing them.

- **Agent system not verified inside Claude Code.** The guard hook did not fire in the session that created it (`git commit -h` ran without a prompt). The skills and subagents have never been run. The owner runs the first-session checks in [GUIDE.md](GUIDE.md) (section 2), then the results are recorded here.

## Decisions waiting for approval

- P1-T4: the starter READMEs, the unused starter files listed above, and the empty `models/` folder. (Decided: keep `apps/admin` and `packages/ui`.)
- Final model size (P2-T2). Size M is only a recommendation.
- Creating the `brainx` and `brainx_test` databases (P5-T3).
- Each package, before it's installed.

## Confirmed on 2026-11-02

- Train from scratch (approach A).
- Dataset plan and ML package plan in `docs/MODEL.md`.
- Backend plan and PostgreSQL in `docs/BACKEND.md`.
- The product is a public portfolio app: email-and-password registration/login, private per-user conversations, and a later HTTPS deployment are in scope. Hosting provider, domain, budget, production secrets, and Bengali-model support are not chosen yet.
- Folders are created by the task that needs them. One approved exception: the owner asked for the `model/` structure up front (committed in `abbf5f1`), so its seven notebooks, six `.py` files, `training.yaml`, and `pyproject.toml` exist as empty placeholders. They get their content only in their own tasks.

## Training results

None yet.
