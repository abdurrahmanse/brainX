# brainX: Tasks

Do one task at a time, in order, after approval. Tasks run on the workflow in [AGENTS.md](../AGENTS.md). Current status is in [PROGRESS.md](PROGRESS.md).

Files marked with `*` are changed rather than created. Check the real repo before each task, because this plan can change as we learn.

## Phase 1: Planning & Setup

| ID | Task | Files | Done when |
|---|---|---|---|
| P1-T1 | Requirements and environment assessment | None | Owner confirms hardware, model path, and features |
| P1-T2 | Project documentation | `docs/`, `AGENTS.md`*, `CLAUDE.md`, `README.md`* | Docs exist and agree, and old docs are removed |
| P1-T3 | Check the Turborepo starter builds | Only what a found problem requires | Install, build, lint, and type-check run, and any error is explained |
| P1-T4 | Remove unused starter parts, with owner approval | `apps/docs`, `packages/ui`, starter READMEs, `apps/web`* | Build still passes without them |
| P1-T5 | Clean up git ignores | `.gitignore`*, `.DS_Store`, `package.json`* | Generated and private files are ignored |
| P1-T6 | Set up Python and connect it to Turborepo | `pyproject.toml`, `.python-version`, `uv.lock`, `turbo.json`*, `package.json`*, `pnpm-workspace.yaml`*, `apps/api/package.json` | One command runs a sample pytest test, and root imports work |

## Phase 2: Model Preparation

| ID | Task | Files | Done when |
|---|---|---|---|
| P2-T1 | Confirm model size and limits with the owner | `docs/MODEL.md`* | Owner chooses a size after an explanation |
| P2-T2 | Confirm dataset licences and versions | `docs/MODEL.md`* | Each dataset has a confirmed licence and version, or is replaced |
| P2-T3 | Download the datasets | `model/prepare_data.py`, `pyproject.toml`* | Download works and won't repeat unnecessarily |
| P2-T4 | Clean and split the text | `model/prepare_data.py`*, `model/tests/test_prepare_data.py` | Tests pass, and splits have no duplicates across them |
| P2-T5 | Format instruction and conversation data | `model/prepare_data.py`*, `model/tests/test_prepare_data.py`* | Tests pass on Dolly and OASST1 samples |
| P2-T6 | Write a short data report | `docs/MODEL.md`* | Real counts and samples are recorded |
| P2-T7 | Write BPE training | `model/tokenizer.py`, `model/tests/test_tokenizer.py` | Result matches a hand-worked example |
| P2-T8 | Write encode, decode, and chat format | `model/tokenizer.py`*, `model/tests/test_tokenizer.py`* | Text, emoji, and special tokens round-trip |
| P2-T9 | Train the tokenizer and encode the data | `model/prepare_data.py`* | Vocabulary has 8,000 tokens, and decoding a slice returns the source |
| P2-T10 | Add training configuration | `model/config.py` | S, M, and L load with the expected values |

## Phase 3: Model Training

| ID | Task | Files | Done when |
|---|---|---|---|
| P3-T1 | Write the Transformer | `model/gpt.py`, `model/tests/test_gpt.py` | Size M has the expected parameter count, and later tokens can't affect earlier outputs |
| P3-T2 | Write the training loop | `model/train.py`, `model/tests/test_train.py` | Starting loss is near 8.99, and one small batch overfits |
| P3-T3 | Add checkpoint saving and resume | `model/train.py`*, `model/tests/test_train.py`* | Resume continues from the saved step |
| P3-T4 | Save metrics and run details | `model/train.py`* | Each run saves config, seed, commit, and metrics |
| P3-T5 | Run a short training test | `model/train.py`* if needed | A 10-minute size S run finishes and real speed is recorded |
| P3-T6 | Add fine-tuning mode | `model/train.py`*, `model/tests/test_train.py`* | Tests confirm only assistant tokens count toward loss |
| P3-T7 | Write fixed test prompts before the full run | `model/eval_prompts.jsonl` | About 30 prompts exist |
| P3-T8 | Full pre-training run, with owner approval | `docs/PROGRESS.md`* | Real results and checkpoint location are recorded |
| P3-T9 | Fine-tuning run, with owner approval | `docs/PROGRESS.md`* | Real results and checkpoint location are recorded |

## Phase 4: Model Evaluation

| ID | Task | Files | Done when |
|---|---|---|---|
| P4-T1 | Write text generation and sampling | `model/inference.py`, `model/tests/test_inference.py` | With a fixed seed, CPU output repeats exactly, and stop tokens work |
| P4-T2 | Add context trimming for conversations | `model/inference.py`*, `model/tests/test_inference.py`* | Tests cover short and over-limit conversations |
| P4-T3 | Add streaming output | `model/inference.py`*, `model/tests/test_inference.py`* | Split characters such as emoji decode correctly |
| P4-T4 | Evaluate against the bigram baseline and fixed prompts | `model/evaluate.py`, `model/tests/test_evaluate.py`, `docs/MODEL.md`* | Real scores and raw outputs are saved |
| P4-T5 | Add a terminal chat and measure speed and memory | `model/inference.py`*, `docs/MODEL.md`* | Owner chats in a terminal, and real numbers are recorded |

**Model milestone:** the owner confirms the local model generates text from a prompt without any external API. Phase 5 starts only after this.

## Phase 5: Backend

| ID | Task | Files | Done when |
|---|---|---|---|
| P5-T1 | Set up FastAPI with `GET /health` | `apps/api/main.py`, `apps/api/tests/test_api.py`, `pyproject.toml`* | Test passes, and the server runs on `127.0.0.1` |
| P5-T2 | Load the model at startup | `apps/api/main.py`*, `apps/api/tests/test_api.py`* | Health reports the model state, and a missing model doesn't crash it |
| P5-T3 | Add `POST /chat` with a full reply | `apps/api/main.py`*, `apps/api/tests/test_api.py`* | A test request gets a reply using a small test checkpoint |
| P5-T4 | Stream the reply with SSE | `apps/api/main.py`*, `apps/api/tests/test_api.py`* | Events arrive in the documented order |
| P5-T5 | Add errors and the one-reply limit | `apps/api/main.py`*, `apps/api/tests/test_api.py`* | 409, 422, and 503 are tested |

## Phase 6: Frontend

| ID | Task | Files | Done when |
|---|---|---|---|
| P6-T1 | Replace the starter page and add Tailwind | `apps/web/`* | Build passes with one styled element |
| P6-T2 | Add design tokens | `apps/web/app/globals.css`* | Tokens match `docs/DESIGN.md` in light and dark |
| P6-T3 | Build the page layout and empty state | `apps/web/app/page.tsx`*, `apps/web/components/` | Matches the layout in `docs/DESIGN.md` |
| P6-T4 | Build the message list | `apps/web/components/` | Shows sample messages in every documented state |
| P6-T5 | Build the message box and `SEND` | `apps/web/components/` | `Enter` and `Shift+Enter` behave as documented |
| P6-T6 | Check small screens and keyboard use | `apps/web/`* | No sideways scrolling, and all controls work by keyboard |

## Phase 7: Integration

| ID | Task | Files | Done when |
|---|---|---|---|
| P7-T1 | Allow the frontend through CORS | `apps/api/main.py`*, `apps/api/tests/test_api.py`* | The allowed origin works, and others are refused |
| P7-T2 | Write the API client and stream reader | `apps/web/lib/` | Tests or a manual check cover events split across chunks |
| P7-T3 | Connect the chat with a live reply | `apps/web/`* | A reply streams from the real model in the browser |
| P7-T4 | Send earlier messages as context | `apps/web/`* | A follow-up message includes earlier messages in its request |
| P7-T5 | Show errors in the UI | `apps/web/`* | Busy, no model, and server-down errors each appear |

## Phase 8: Final Testing

| ID | Task | Files | Done when |
|---|---|---|---|
| P8-T1 | Run all tests and fix found bugs | Files for each approved bug | Tests pass, and the bug list is resolved or recorded |
| P8-T2 | Test offline | `docs/PROGRESS.md`* | Chat works with the internet off |
| P8-T3 | Polish the UI | `apps/web/`* | Owner approves the look |
| P8-T4 | Finish the README | `README.md`* | A clean clone can follow it, and results are real |
| P8-T5 | Prepare the portfolio demo | `README.md`*, `docs/` | Screenshots and a short demo script exist |
