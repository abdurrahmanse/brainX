# brainX: Tech Stack

**Status:** Proposed, awaiting owner approval. **Versions checked:** 2026-11-02.

Any dependency not listed here needs a written reason and owner approval. See [AI_AGENT_RULES.md](AI_AGENT_RULES.md). Pin exact versions and commit the lockfiles.

## How the versions were checked

| Label | Meaning |
|---|---|
| **In repo** | Already declared by the `create-turbo` starter |
| **Installed** | Installed together on this Mac in a throwaway environment, and imported |
| **Resolved** | The dependency resolver accepted the set, but it was not imported or run |
| **Latest** | Latest version from the registry, and not yet tried in this project |

Phase 1 is where the full set first runs in the real repository.

## Workspace and frontend

| Tool | Version | Status | Why it is here |
|---|---|---|---|
| Node.js | 26.13.0 (LTS); repo requires `>=24` | Installed on the Mac | Runtime for the frontend tools |
| pnpm | 11.25.0 | In repo | Workspace package manager |
| Turborepo | 2.11.10 | In repo | Required by the brief; one command for tasks in both languages |
| Next.js | 16.3.8 | In repo | Required by the brief |
| React / React DOM | 19.2.8 | In repo | Required by the brief |
| TypeScript | 7.0.2 | In repo | Required by the brief |
| ESLint | 10.9.1 | In repo | Starter's linter |
| Prettier | 3.9.6 | In repo | Starter's formatter |
| Tailwind CSS | 4.3.3 | Latest | Required by the brief |
| Vitest | 5.0.5 | Latest | Unit tests for the stream parser and API client |
| Testing Library (React) | 16.3.3 | Latest | Chat component tests |
| Playwright | 1.64.1 | Latest | One end-to-end browser test in Phase 10 |

**TypeScript 7 check:** a minimal Next.js 16.4.3 app passed `next build` under TypeScript 7.0.2 on this Mac. The starter's Next.js 16.3.8 has not been built yet, so Phase 1 checks it. If it fails, the fallback is TypeScript 5.9.3.

## Backend and ML

Python 3.13 is pinned in `apps/backend/.python-version`. The Mac's default Python is 3.14, so this pin matters. `uv` 0.12.15 manages Python and dependencies.

| Package | Version | Status | Why it is here | Used by |
|---|---|---|---|---|
| Python | 3.13.15 | Installed | Language; PyTorch has arm64 wheels for it | All |
| torch | 2.15.0 | Installed, MPS confirmed available | Required by the brief | `model`, `training`, `inference`, `dataset` |
| numpy | 2.5.4 | Resolved | Memory-mapped token files | `dataset` |
| datasets | 5.1.0 | Installed | Downloads datasets. Optional group, not used by the server | `dataset` |
| fastapi | 0.162.0 | Installed, `fastapi.sse` confirmed | Required by the brief, and includes SSE support | `api` |
| uvicorn | 0.54.0 | Installed | Runs FastAPI | `api` |
| pydantic-settings | 2.16.2 | Installed | Reads and validates server settings | `config` |
| pytest | 9.2.0 | Installed | Tests (dev only) | All |
| httpx | 0.28.1 | Installed | FastAPI's test client needs it (dev only) | `api` tests |
| ruff | 0.17.3 | Installed | Lint and format (dev only) | All |
| pyright | 1.1.414 | Installed | Type checking (dev only) | All |
| import-linter | 2.15 | Installed | Enforces the module rules (dev only) | All |

The trimmed list above resolved as one set. It is a subset of the larger set that was actually installed and imported, with numpy as the sole addition.

SQLite comes from Python's standard library. The Mac's `sqlite3` command-line tool is 3.54.0, and the version Python links to is checked in Phase 8.

## Deliberately not used

| Not used | Reason |
|---|---|
| `transformers`, `peft`, pre-trained models | Forbidden by C2. Banned by a test |
| `openai`, `anthropic`, `google-generativeai`, Ollama | Forbidden by C1. Banned by a test |
| `tokenizers`, `sentencepiece` | The tokenizer is project-written (C4, ADR-008). Decision D3 can change this for SentencePiece |
| `accelerate`, Lightning | A plain training loop teaches more, and only one device is involved |
| `safetensors` | `torch.save` with `weights_only=True` loading is enough for private local files |
| TensorBoard, Weights & Biases | `metrics.jsonl` is enough. W&B would also send data off the machine |
| MLX, llama.cpp | A second runtime and format with no MVP need. May be evaluated later if CPU speed falls short |
| SQLAlchemy, Alembic, aiosqlite | Two tables do not justify them (ADR-007) |
| PostgreSQL, Redis, Celery | The brief specifies SQLite, and one user needs no queue |
| `sse-starlette` | FastAPI 0.162.0 includes `fastapi.sse` |
| `openapi-typescript` | Requires TypeScript `^5.x`, which conflicts with the repo's 7.0.2. Seven endpoints can have hand-written types |
| shadcn/ui, Redux, TanStack Query | Tailwind and React state suffice for one chat screen |
| `react-markdown` | MVP output is plain text, and a small model will rarely produce useful Markdown |
| Biome | The starter already uses ESLint and Prettier |
| Docker | Everything is local, and MPS is unavailable inside Docker on macOS |
| Turborepo's native uv support | Experimental in 2.11.10 (ADR-002) |

## Upgrades

Do not upgrade during a phase unless a task needs it. Upgrades are their own task with full verification. Never upgrade PyTorch during a training run, since a change could affect results or make a run hard to reproduce.
