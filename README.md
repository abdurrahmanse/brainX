# brainX

A simple ChatGPT-like text chatbot, built as a student portfolio project, running on a small language model trained locally from scratch.

**Status: planning.** The app and the model don't exist yet, so there is nothing to run. See [progress](docs/PROGRESS.md).

## Goals

- Learn how language models work by building a small one from scratch.
- Train and run it on one Mac, with no external AI APIs and no pre-trained weights.
- Chat with it through a Minimalist + Neo-Brutalist web interface.

It's an educational model, so it will not perform like ChatGPT or Claude, and its answers will often be wrong.

## Planned stack

| Part | Technology |
|---|---|
| Monorepo | Turborepo |
| Frontend | Next.js, React, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Python, FastAPI, PostgreSQL |
| Model | PyTorch |

## Documentation

| File | Contents |
|---|---|
| [PROJECT.md](docs/PROJECT.md) | Goals, decisions, and MVP scope |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, folders, and API |
| [MODEL.md](docs/MODEL.md) | Data, tokenizer, training, and evaluation plan |
| [BACKEND.md](docs/BACKEND.md) | API, database, backend packages, and tasks |
| [FRONTEND.md](docs/FRONTEND.md) | Frontend packages, structure, and tasks |
| [DESIGN.md](docs/DESIGN.md) | UI rules |
| [TASKS.md](docs/TASKS.md) | Phases and tasks |
| [PROGRESS.md](docs/PROGRESS.md) | Current status |

Setup instructions will be added once the project can run.
