# brainX: Documentation Audit

**Audited:** 2026-11-02, at git commit `de03224`, plus one uncommitted change: the empty `model/` folder structure created at the owner's request while this audit ran.

**Scope:** documentation readiness only. No application code was written, no packages were installed in the repo, and no training ran. No documentation file other than this report was changed.

**How to read this report:** "Verified" means checked against the repo or a command run during this audit. "Recommendation" means an opinion. Items I could not check are listed in [Not verified](#not-verified).

## Section 1: Executive summary

**Verdict: READY WITH MINOR FIXES**

The plan is complete enough to start Phase 1. I found no contradiction that makes the architecture unworkable, and no task that depends on a later task. The weak spots are:

1. The tasks you will do **first** (Phase 1) are only one-line table rows, while later phases have full specifications.
2. Deployment and local setup are barely documented.
3. A few statements are stale or slightly inaccurate (listed in Sections 4 and 6).

**Overall readiness: 3.4 / 5** (average of ten category scores in Section 3).

## Section 2: Documentation inventory

| Item | Status | Evidence |
|---|---|---|
| `README.md` (37 lines) | Incomplete | Ends with "Setup instructions will be added once the project can run" (line 37) |
| `AGENTS.md` (88 lines) | Verified, complete | Turborepo block intact, plus workflow and rules |
| `CLAUDE.md` (3 lines) | Verified | Imports `AGENTS.md`, so both tools read the same rules |
| `docs/PROJECT.md` | Incomplete | No user workflows, no non-functional requirements section, no per-feature acceptance criteria |
| `docs/ARCHITECTURE.md` (95 lines) | Verified | Overview, folders, dependency rules, decisions, security |
| `docs/MODEL.md` (580 lines) | Verified, 29 task specs | |
| `docs/BACKEND.md` (563 lines) | Verified, 20 task specs | |
| `docs/FRONTEND.md` (252 lines) | Verified, 16 task specs | |
| `docs/DESIGN.md` (101 lines) | Verified, one inaccurate claim | See issue M6 |
| `docs/TASKS.md` (149 lines) | Incomplete | 79 tasks; 14 have no specification |
| `docs/PROGRESS.md` (40 lines) | Stale | See issue C1 |

**Missing, and worth adding:** a local setup and run guide, and a short testing strategy.

**Not needed for this project:** a separate PRD, tech-stack file, security file, or ADR folder. The "Key decisions" table in `docs/ARCHITECTURE.md` and the sections in `docs/BACKEND.md` already cover these.

**Repo state verified:**

- `apps/web` and `apps/admin` are committed. `pnpm-lock.yaml` lists both (`apps/admin` at line 21).
- `apps/admin/package.json` is still named `"docs"`.
- `packages/ui` and an empty root `models/` folder still exist.
- `model/` exists with seven empty valid notebooks, six empty `.py` files, an empty `training.yaml`, an empty `pyproject.toml`, and five empty directories. It has no `__init__.py`.
- `apps/api` does not exist yet, which matches the plan.

## Section 3: Readiness scorecard

| # | Category | Score | Evidence |
|---|---|:-:|---|
| 1 | Product requirements | 3 | `docs/PROJECT.md` has an objective, 10 MVP features, exclusions, and "Definition of finished". It lacks user workflows, non-functional requirements, and acceptance criteria per feature. |
| 2 | Architecture | 4 | `docs/ARCHITECTURE.md` "Who can use what" and `docs/BACKEND.md` "Modules" give clear dependency direction, and "Lifecycles" covers data flow. The `uv` workspace layout was tested in a temporary folder. Minor stale statements remain (C2). |
| 3 | Model training | 4 | `docs/MODEL.md` covers strategy, hardware, datasets, tokenizer, model, training, evaluation, and notebooks. Gaps: export location, fixed-prompts file location, and no task that writes the baseline (M2, M3, M4). |
| 4 | Backend | 4 | `docs/BACKEND.md` has the API, database, lifecycles, errors, and configuration. One env var is missing from "Configuration" (M5). |
| 5 | Frontend | 4 | 16 task specs and design tokens. Two accuracy issues (M6, M7), and the API base URL is never defined (M8). |
| 6 | Integration | 3 | The API contract is in `docs/BACKEND.md`. `docs/FRONTEND.md` never says how it reads the SSE events or keeps types in sync, and Phase 7 has no specifications. |
| 7 | Testing | 3 | Tests appear in each task spec and in `docs/BACKEND.md` "Testing". There is no combined strategy, E2E is one table row, and 7 Verify steps have no command. |
| 8 | Deployment | 2 | No setup or run guide. `README.md` line 37 defers it. PostgreSQL creation exists only inside P5-T3. The Docker daemon isn't running. |
| 9 | AI agent rules | 4 | `AGENTS.md` has the workflow, approval, one-task rule, session start, package rules, and training rules. Gaps: no completion-report template, and one rule now conflicts with `model/` (C2). |
| 10 | Task roadmap | 3 | 79 unique IDs and no forward prerequisites. But 14 tasks have no spec (C3), and prerequisites are inconsistent across files (M1). |

**Overall: 34 / 50 = 3.4 / 5.**

## Section 4: Critical issues

These are not blockers for a careful agent, because `AGENTS.md` tells it to compare the repo with the progress file. But they would give the first task a wrong starting picture, so fix them before Phase 1.

### C1: `docs/PROGRESS.md` is stale

- "Known problems", the second bullet (line 22), says the `apps/docs` to `apps/admin` rename is "uncommitted" and that `pnpm-lock.yaml` "still says `apps/docs`".
- **Facts:** the rename is committed (`de03224`), and `pnpm-lock.yaml` line 21 lists `apps/admin`. The package inside is still named `docs`, which remains true.
- `docs/ARCHITECTURE.md` "Folders" line 35 describes the rename correctly.

### C2: The "create folders only when needed" rule contradicts the repo

These statements were true until the owner asked for the `model/` structure, which now exists:

- `AGENTS.md` line 61: "Create files or folders before the task that needs them" (under **Never**).
- `docs/PROGRESS.md` line 36: "Folders are created by the task that needs them."
- `docs/MODEL.md` "Folder structure" line 44: "most of this doesn't exist yet."
- `docs/ARCHITECTURE.md` "Folders" line 22: folders marked "planned" don't exist, and `model/` is marked planned.

I have not chosen between the options, because this is your decision (see Section 6, A1).

### C3: Phase 1 tasks have no specification

- `docs/TASKS.md` Phase 1 gives P1-T1 to P1-T6 only a title, files, and "Done when".
- Every task in Phases 2 to 6 has objective, prerequisites, files, steps, acceptance, verify command, and learning notes.
- **Why it matters:** P1-T6 sets up the whole Python workspace. Other tasks' Verify commands use `uv run --package brainx-model` and `--package brainx-api` (for example `docs/MODEL.md` line 271 and `docs/BACKEND.md` line 412). Those two package names appear in no task row. The count of `brainx-model` in `docs/TASKS.md` is 0. The same applies to `model/src/__init__.py`, which a temporary test showed `uv` requires (build failed: "Expected a Python module at: model/src/__init__.py").

## Section 5: Minor improvements

| # | Finding | Where |
|---|---|---|
| M1 | The "Dependencies" field means different things: task prerequisites in `docs/BACKEND.md`, but packages in `docs/FRONTEND.md` (for example line 221, `zustand`). Frontend tasks therefore have no explicit prerequisite task. | `docs/FRONTEND.md` "Tasks" |
| M2 | The bigram baseline is used in `docs/MODEL.md` line 226 and P4-T5 (line 544), but no task creates it. | `docs/MODEL.md` "Evaluation", P4-T5 |
| M3 | `model/eval_prompts.jsonl` (line 224 and P3-T8) is outside the folder structure you specified. | `docs/MODEL.md` |
| M4 | The location of the exported model artifact isn't stated anywhere. `BRAINX_CHECKPOINT` points to a folder, but P4-T7 doesn't say where it is written, and `model/checkpoints/` and `model/outputs/` are not assigned clear roles. | `docs/MODEL.md` P4-T7, "Training pipeline" |
| M5 | `docs/BACKEND.md` P5-T3 (line 392) uses `BRAINX_DATABASE_URL_SYNC`, but "Configuration" lists only `BRAINX_DATABASE_URL`. | `docs/BACKEND.md` |
| M6 | `docs/DESIGN.md` line 18 says each colour has "at least 7:1 contrast". Calculated: light `accent` `#0038FF` on white is **6.98:1**, and white on `accent` is the same. It still passes WCAG AA (4.5:1). Other colours are 7.0:1 or better. | `docs/DESIGN.md` "Colours" |
| M7 | `docs/FRONTEND.md` line 11 says "every package below was installed" in the compatibility test, but the `shadcn` CLI was not installed in that project. Also `@tanstack/react-query` is listed as 5.105.1 (line 28) but the test installed 5.105.0, and `react-resizable-panels` is 4.16.1 (line 40) but the test installed 4.16.0. Everything else listed matched. | `docs/FRONTEND.md` "Packages" |
| M8 | The frontend's API base URL setting (for example `NEXT_PUBLIC_API_URL`) appears in no document, although P6-T11 writes the API client. | `docs/FRONTEND.md`, `docs/BACKEND.md` "Configuration" |
| M9 | The OpenAPI file is the source of truth for schemas (`docs/BACKEND.md` "API"), but the frontend hand-writes types in `src/types`. No task checks for drift. | `docs/FRONTEND.md` "Folder structure" |
| M10 | `docs/FRONTEND.md` P6-T11 doesn't name the SSE events (`start`, `delta`, `done`, `error`) it must handle. | `docs/FRONTEND.md`, `docs/BACKEND.md` "Stream events" |
| M11 | Seven Verify entries contain no command: P2-T2, P2-T3, P2-T10, P3-T1, P3-T8, P4-T5, P4-T6. Most say "Owner reviews", which is reasonable for decisions. | `docs/MODEL.md` |
| M12 | No completion-report format. `AGENTS.md` step E describes teaching, but there is no template for reporting results. | `AGENTS.md` "Each task" |
| M13 | These tasks may be too large to review as one change: P2-T6 (cleaning, OASST1 rebuild, and a notebook), P3-T4 (training loop with about nine parts), P5-T11 (route, thread, queue, SSE, and two transactions). This is a judgement, and each task's Explain step can propose a split. | `docs/MODEL.md`, `docs/BACKEND.md` |

## Section 6: Architecture conflicts and unresolved decisions

### Conflicts

| # | Conflict | Files | Status |
|---|---|---|---|
| A1 | Folder-creation rule against the created `model/` structure (see C2) | `AGENTS.md`, `docs/PROGRESS.md`, `docs/MODEL.md`, `docs/ARCHITECTURE.md` | **Owner decision.** Options: keep the rule and treat `model/` as an approved exception, or relax the rule. |
| A2 | `pytest` is first added in P1-T6 (`docs/MODEL.md` line 84) and in P5-T1 (`docs/BACKEND.md` "Packages" and the `docs/TASKS.md` Phase 5 table). | `docs/MODEL.md`, `docs/BACKEND.md`, `docs/TASKS.md` | Needs one owner for the install. |
| A3 | Your requirement list names scikit-learn and Hugging Face libraries "where appropriate". `docs/MODEL.md` "Packages" marks scikit-learn "Not needed" and uses only `datasets`. | `docs/MODEL.md` | **Owner decision.** I did not change either. |

### Unresolved decisions (all already flagged in the docs)

- Final model size (P2-T2). Size M is a recommendation.
- Dataset licences and versions (P2-T3). Simple Wikipedia comes from `wikimedia/wikipedia`; confirm.
- Whether `safetensors` is used for export (P4-T7).
- The fate of `apps/admin`, `packages/ui`, the starter READMEs, and the empty `models/` folder (P1-T4).
- Starter build status. A temporary copy failed with `next: command not found`; the real repo hasn't been run (P1-T3).

### Checked, and no conflict found

- PostgreSQL appears in all backend documents. The word "SQLite" appears once, in `docs/BACKEND.md`, as the thing replaced.
- Next.js, FastAPI, and from-scratch training are stated consistently.
- Route names, SSE events, and the `BRAINX_CHECKPOINT` variable match across files.
- `max_new_tokens` limits (1 to 300) and defaults match between `docs/MODEL.md` and `docs/BACKEND.md`.
- Links between documents: none are broken.

## Section 7: Task roadmap review

**Verified:** 79 tasks, all unique (P1: 6, P2: 10, P3: 11, P4: 8, P5: 20, P6: 16, P7: 3, P8: 5). The 65 specified tasks have all their required fields. None lists a prerequisite that comes later in the roadmap. The model milestone (P4-T8) precedes all backend and frontend work.

| Finding | Detail |
|---|---|
| Tasks without specs | P1-T1 to P1-T6, P7-T1 to P7-T3, P8-T1 to P8-T5 (14 tasks) |
| Possible missing tasks | Bigram baseline (M2). A simple local setup and run guide. A frontend API URL setting (M8). An optional types drift check (M9). |
| Duplicate tasks | None found |
| Wrong dependencies | None found among specified tasks. Frontend prerequisites are unstated (M1). |
| Unnecessary tasks | None clearly. P5-T19 (Docker) and P5-T20 (scans) are portfolio additions that you approved. |
| Progress tracking | `docs/PROGRESS.md` marks P1-T1 and P1-T2 done with evidence, but it is stale (C1). |

## Section 8: Dependency review

### Verified compatibility

- **Backend:** FastAPI, Uvicorn, Pydantic settings, SQLAlchemy asyncio, asyncpg, Alembic, structlog, pytest, pytest-asyncio, pytest-cov, httpx, ruff, mypy, pre-commit, bandit, pip-audit, Prometheus instrumentator, and sse-starlette resolved and installed together on Python 3.13. Versions matched the docs. With a temporary PostgreSQL 18.6, an async query and an async Alembic migration worked.
- **ML:** torch, numpy, pandas, datasets, regex, ftfy, matplotlib, tqdm, pyyaml, psutil, safetensors, tensorboard, jupyterlab, ipykernel, ipywidgets, and pytest **resolved** together. They were not installed together, except `torch`, which was installed and used on MPS earlier.
- **Frontend:** packages installed in a temporary project with Next.js 16.3.8, and `next build` and strict `tsc --noEmit` passed. Not tested: Tailwind styling, `shadcn init`, Vitest, and Playwright running.

### Classification

| Package | Class | Note |
|---|---|---|
| `torch`, `numpy`, `pandas`, `datasets`, `regex`, `pyyaml`, `matplotlib`, `jupyterlab`, `ipykernel`, `psutil`, `tqdm` | Essential | Each is used by a named task |
| `fastapi`, `uvicorn`, `pydantic-settings`, `sqlalchemy`, `asyncpg`, `alembic`, `structlog`, `pytest`, `pytest-asyncio`, `httpx`, `ruff`, `mypy` | Essential | |
| `next`, `react`, `tailwindcss`, `radix-ui`, `shadcn` CLI, `lucide-react`, `react-markdown`, `remark-gfm`, `shiki`, `next-themes`, `vitest`, Testing Library | Essential | |
| `@tanstack/react-query` | Essential | History comes from the API |
| `sonner`, `zustand`, `@playwright/test` | Useful enhancement | `zustand` holds only four generation settings, so plain React state plus `localStorage` could replace it. You asked for it, so I kept it. |
| `pytest-cov`, `prometheus-fastapi-instrumentator`, `bandit`, `pip-audit`, `pre-commit`, Docker Compose | Optional | Portfolio additions |
| `motion` | Optional | Added only if CSS can't do a transition |
| `ftfy`, `ipywidgets`, `tensorboard`, `safetensors` | Optional | |
| `react-hook-form`, `zod`, `@hookform/resolvers`, `react-resizable-panels` | Optional | Documented as "add only if" |
| `starlette`, `pydantic` | Redundant to list | They arrive with FastAPI. The docs already say not to add them directly. |
| `scipy`, `scikit-learn`, `plotly`, `evaluate`, `rouge-score`, `sacrebleu`, `transformers`, `peft`, `trl`, `accelerate`, `tokenizers`, `sse-starlette`, `psycopg`, `redis`, `arq`, `slowapi`, auth packages, `rich`, `opentelemetry-sdk`, `sentry-sdk`, `factory-boy` | Unnecessary now | Documented as not used. `sentry-sdk` also sends data outside the machine. |
| `bitsandbytes`, `pynvml` | Not applicable | No NVIDIA GPU on this Mac |

### Recommended installation sequence

This follows the "New packages" columns already in `docs/TASKS.md`. Each is installed only in its task, after approval.

1. **P1-T6:** `pytest`, and `uv` itself.
2. **P2-T1:** `torch`, `jupyterlab`, `ipykernel`, `psutil`.
3. **P2-T4 to P2-T8:** `datasets`, then `pandas`, `numpy`, `matplotlib`, then `regex`, and `ftfy` only if needed.
4. **P3-T3, P3-T4:** `pyyaml`, `tqdm`.
5. **P5-T1 to P5-T5:** the FastAPI core, then database packages. `pytest` must not be added twice (A2).
6. **P5-T15 to P5-T20:** `structlog`, `pytest-cov`, the metrics package, then scans and `pre-commit`.
7. **P6-T1 to P6-T14:** frontend packages in the task order of `docs/FRONTEND.md`.
8. **P7-T3:** Playwright.

Re-check each version when you install it, because the registry moves on. The test project got 5.105.0 where the docs say 5.105.1, so exact versions can differ from registry listings.

## Section 9: Recommended fixes

This is the smallest set of changes, and I have not made any of them.

| # | Fix | Files | Resolves |
|---|---|---|---|
| 1 | Update the "Known problems" bullet about `apps/admin`: committed, lockfile lists it, package name is still `docs`. | `docs/PROGRESS.md` | C1 |
| 2 | Decide A1, then update the folder-creation wording in the four places. | `AGENTS.md`, `docs/PROGRESS.md`, `docs/MODEL.md`, `docs/ARCHITECTURE.md` | C2, A1 |
| 3 | Expand P1-T3 to P1-T6 into full specs. In P1-T6, state the package names `brainx-model` and `brainx-api` and the `__init__.py` requirement. | `docs/TASKS.md` | C3 |
| 4 | Add short specs for P7-T1 to P7-T3 and P8-T1 to P8-T5, including Verify commands. | `docs/TASKS.md` | Section 7 |
| 5 | Add `NEXT_PUBLIC_API_URL`, `BRAINX_DATABASE_URL_SYNC` (or change P5-T3's command), and the export location to the relevant tables. | `docs/BACKEND.md`, `docs/FRONTEND.md`, `docs/MODEL.md` | M4, M5, M8 |
| 6 | Add prerequisites to each frontend task, and name the SSE events in P6-T11. | `docs/FRONTEND.md` | M1, M10 |
| 7 | Say which task creates the bigram baseline, and where `eval_prompts.jsonl` lives. | `docs/MODEL.md` | M2, M3 |
| 8 | Decide one task that installs `pytest`. | `docs/MODEL.md`, `docs/BACKEND.md`, `docs/TASKS.md` | A2 |
| 9 | Correct the contrast claim to "at least 6.9:1" (or darken `accent`), and the test claim in `docs/FRONTEND.md` line 11. Fix the two version numbers. | `docs/DESIGN.md`, `docs/FRONTEND.md` | M6, M7 |
| 10 | Add a short local setup and run section (database creation, env files, start order), and a completion-report template. | `README.md` or a new `docs/SETUP.md`, `AGENTS.md` | Deployment score, M12 |
| 11 | Add user workflows and non-functional requirements (offline, memory, local-only) to the project overview. | `docs/PROJECT.md` | Category 1 |

## Not verified

- Mermaid diagrams (5 blocks across `docs/ARCHITECTURE.md`, `docs/BACKEND.md`, `docs/TASKS.md`) were not rendered. I only confirmed the fences are balanced.
- No verification command in any task spec was run, because the code they check doesn't exist yet.
- Dataset facts (rows, licence tags) come from Hugging Face on 2026-11-02 and were not re-fetched in this audit.
- The training and generation speeds in `docs/MODEL.md` come from earlier 40-second tests on random data. They were not repeated.
- Whether the starter builds in the real repo (P1-T3).
- Whether the PostgreSQL server on port 5432 is version 18.6. Only the installed binary reports 18.6, and the server accepts connections.

## Section 10: Final verdict

**The project is ready to start Phase 1.** The structure, decisions, dependency order, and agent rules are solid for a student portfolio project, and nothing needs to be redesigned.

Before P1-T3, fix items 1 to 3 in Section 9 (about five files). The remaining items can wait until the phase they affect:

- Items 4 to 6 before Phases 5 to 7.
- Items 9 to 11 before Phase 8.

Docs written without any code to test against will drift. Each phase's gate should therefore re-run this audit's checks, which are quick.

## Follow-up status (2026-11-02, after fixes)

This section was added after the audit above. The scores in Section 3 come from the original audit and were **not recomputed**. Each item below was checked by re-reading the changed files and running the same link, task-ID, and prerequisite checks.

| Item | Status | What changed |
|---|---|---|
| C1 `PROGRESS.md` stale | Resolved | Rename recorded as committed; frozen install flagged as unrun |
| C2 Folder rule against `model/` | Resolved | `model/` recorded as an approved exception in four files |
| C3 Phase 1 specs | Resolved | P1-T3 to P1-T6 specified; P7-T1 to P8-T5 specified too |
| A1 Rule conflict | Resolved | Same as C2 |
| A2 `pytest` installed twice | Resolved | Installed once, in P1-T6 |
| A3 scikit-learn and Hugging Face libraries | **Open** | Owner decision; `docs/MODEL.md` still marks scikit-learn "Not needed" |
| M1 Prerequisite fields differ | Resolved | Every task in `docs/BACKEND.md` and `docs/FRONTEND.md` now has "Prerequisites"; frontend "Dependencies" renamed "Packages" |
| M2 Bigram baseline | Resolved | P4-T5 now writes and tests it |
| M3 `eval_prompts.jsonl` location | Resolved | Moved to `model/configs/eval_prompts.jsonl`, inside your structure |
| M4 Export location | Resolved | `model/checkpoints/export/`; run files in `model/checkpoints/<run>/` and `model/outputs/runs/<run>/` |
| M5 `BRAINX_DATABASE_URL_SYNC` | Resolved | Removed; P5-T3 uses `psql -d brainx` |
| M6 Contrast claim | Resolved | Corrected to "at least 6.9:1" |
| M7 Frontend test claim and versions | Resolved | `shadcn` CLI exception stated; two versions set to those tested |
| M8 API base URL | Resolved | `NEXT_PUBLIC_API_URL` documented in `docs/FRONTEND.md` |
| M9 Type drift | Resolved | One manual comparison with `/openapi.json` added to P6-T11 |
| M10 SSE events | Resolved | P6-T11 names `start`, `delta`, `done`, and `error` |
| M11 Verify without commands | Partly resolved | Notebook tasks now have commands; the rest are owner reviews on purpose |
| M12 Report template | Resolved | "Task report" in `AGENTS.md` |
| M13 Large tasks | **Open** | A judgement; each task's Explain step can propose a split |
| Section 9, fixes 10 and 11 | Resolved in part | Requirements added to `README.md`; user workflows, non-functional requirements, and an MVP acceptance map added to `docs/PROJECT.md`. A full setup guide waits for P8-T4, because its commands do not exist yet |

**Still not verified:** the Mermaid diagrams were not rendered, no task's Verify command has run (the code does not exist), and the Claude Code skills, subagents, and guard hook have not been run inside Claude Code.
