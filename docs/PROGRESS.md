# brainX: Progress

Update this file only after verification supports it. If the repo disagrees with this file, trust the repo and report the difference.

**Current phase:** Phase 1: Planning & Setup

**Next task:** P1-T7: Add GitHub Actions quality baseline

## Task status

| Task | Status | Evidence |
|---|---|---|
| P1-T1 | Done | Owner confirmed hardware, from-scratch training, features, and the simple plan on 2026-11-02 |
| P1-T2 | Done | Docs written; links, task IDs, and old-file references checked on 2026-11-02 |
| P1-T3 | Done | On 2026-11-02, run in the real repo from the root: `pnpm install --frozen-lockfile` exit 0 (6 workspace projects, already up to date); `pnpm build` exit 0 (`web` and `admin` built with Next.js 16.3.8 and TypeScript 7.0.2, 2 of 2 tasks); `pnpm lint` exit 0 (3 of 3 tasks, `--max-warnings 0`); `pnpm check-types` exit 0 (3 of 3 tasks). No tracked file was changed by the runs. They created untracked `.turbo/` folders, which P1-T5 will ignore |
| P1-T4 | Done | On 2026-11-02, the owner separately approved deletion of three starter READMEs, `packages/ui/src/code.tsx`, and 14 unused starter SVG files. `pnpm install` exit 0 (already up to date); `pnpm build` exit 0 (2 of 2 tasks); `pnpm lint` exit 0 (3 of 3 tasks); `pnpm check-types` exit 0 (3 of 3 tasks). No remaining import/reference to deleted files was found, and `git status --short` showed only the 18 approved deletions. |
| P1-T5 | Done | Done early in part, then completed on 2026-11-02: root `.gitignore` and both app `.gitignore` files cover the required generated/private paths and preserve `.env.example`; `.DS_Store` and `.turbo/preferences/tui.json` were untracked while remaining on disk. Root `package.json` was renamed from `my-turborepo` to `brainx`. `git check-ignore -v` showed rules for `.DS_Store`, `.turbo/x`, `.env`, model artifacts, and `.venv/x`; `git check-ignore -q .env.example` exited 1 (not ignored); no tracked `.DS_Store` or `.turbo` path remained; `pnpm build` exit 0 (2 of 2 tasks). |
| P1-T6 | Done | On 2026-11-02, the root `uv` workspace and the `brainx-model` package were created with only `pytest==9.2.0` as a development dependency. `uv sync --all-packages` exit 0, using CPython 3.13.15 and creating `uv.lock`; `uv run --package brainx-model pytest model/tests` exit 0 (1 passed); `pnpm test` exit 0 (Turborepo ran `@brainx/model:test`, 1 passed); and `uv run --package brainx-model python -c "import src; print(src.__file__)"` exit 0, printing `model/src/__init__.py`. `pnpm install` exit 0 and registered the `model` workspace. |
| P2-T1 | Done | On 2026-11-02, `torch==2.15.0`, `jupyterlab==4.6.5`, `ipykernel==7.4.0`, and `psutil==7.2.2` were installed for `brainx-model` and locked. `uv run --package brainx-model python -c "import torch; print(torch.__version__, torch.backends.mps.is_available())"` exit 0, reporting `2.15.0 True`. A real MPS tensor sum returned `5.0`; an `ipykernel_launcher` process remained alive for a three-second startup check; `pytest model/tests` exit 0 (1 passed). Measured: Python 3.13.15, 16.0 GB total memory, 4.1 GB available memory, and 232.6 GB free disk. |
| UI foundation (early, owner's request) | Partial | On 2026-11-02: six UI packages installed (see [FRONTEND.md](FRONTEND.md#ui-foundation-done-early-2026-11-02)), a shared design system built in `packages/ui`, and `web` and `admin` rebuilt on it. `pnpm check-types`, `pnpm lint`, and `pnpm build` passed; `turbo boundaries` found no issues; a second `pnpm build` was fully cached (13 ms). Screenshots of both apps matched DESIGN.md in light, dark, and a true 390px width. **Not checked:** clicking the theme toggle, mobile menu, and toast in a browser; `pnpm dev` hot reload |
| Agent system (setup, not a numbered task) | Partial | Seven Claude skills, seven Codex repo skills, two Claude read-only subagents, the guard hook, its deterministic test, and `docs/GUIDE.md` are written. On 2026-11-02 the guard test passed 13 approval cases and 5 allow cases when run directly. Claude Code and a restarted Codex session still need real discovery/integration checks; see Known problems. |

All other tasks in [TASKS.md](TASKS.md) have not started.

## Known problems

- **An earlier failure is unexplained.** In a temporary copy of the repo, `build` and `check-types` failed with `next: command not found`. The same commands pass in the real repo (P1-T3), so the copy is the likely cause, but the exact cause was never found.

- **`apps/docs` was renamed to `apps/admin` outside the task list.** The rename is committed (`de03224`) and `pnpm-lock.yaml` lists `apps/admin`. The owner has since changed the package name from `docs` to `admin` in `apps/admin/package.json`; that change is committed (`8557f2b`). A frozen install, build, lint, and type-check all passed with it (P1-T3).

- **Running dev servers need a restart.** The `web` and `admin` dev servers were started before the Tailwind and PostCSS files existed. Stop them and run `pnpm dev` again to see the new UI. (The screenshots used separate production servers on ports 3100 and 3101, which are stopped.)

- **Duplicate local Geist font files remain.** P1-T4 removed its approved starter READMEs, `packages/ui/src/code.tsx`, and public SVG images. The duplicate app font files were outside that task's candidate list, so they remain until a separately approved task covers them.

- **Agent system runtime checks remain.** The guard's direct deterministic test passes, but a real Claude Code session must still show the Bash hook and invoke one project skill. A new Codex session must discover one `.agents/skills/` workflow. The owner runs the first-session checks in [GUIDE.md](GUIDE.md), then records the real results here.

## Decisions waiting for approval

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
