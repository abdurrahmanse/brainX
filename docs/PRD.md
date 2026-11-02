# brainX: Product Requirements

**Status:** Proposed, awaiting owner approval. **Last updated:** 2026-11-02.

brainX is a personal, educational project. Its owner builds a small GPT-style language model from scratch, trains it locally, and chats with it through a ChatGPT-like website.

The main goal is **understanding how language models work**. A useful chatbot is the outcome that proves the pipeline works, but it will not be competitive with commercial assistants.

## Related documents

| Document | Answers |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | How the system fits together, API, database, decisions |
| [TECH_STACK.md](TECH_STACK.md) | Which tools and versions, and why |
| [AI_MODEL.md](AI_MODEL.md) | Data, tokenizer, model, training, evaluation, inference |
| [ROADMAP.md](ROADMAP.md) | Ordered phases, tasks, and validation gates |
| [AI_AGENT_RULES.md](AI_AGENT_RULES.md) | How coding agents must work in this repo |

## Fixed constraints

These came from the owner's brief. Changing any of them requires the owner's explicit approval.

| ID | Constraint |
|---|---|
| C1 | No external AI APIs: OpenAI, Claude, Gemini, or Hugging Face hosted inference. |
| C2 | No pre-trained language models. The model is initialised randomly and trained from scratch by the owner. |
| C3 | "Fine-tuning" means instruction-tuning **the owner's own pre-trained model**, never a third-party model. |
| C4 | The tokenizer is created by this project. |
| C5 | Modular monolith with no microservices. |
| C6 | Turborepo, Next.js/React/TypeScript, Tailwind CSS, Python, FastAPI, PyTorch, SQLite. |
| C7 | No unnecessary dependencies, abstractions, services, or features. Beginner-friendly code. |
| C8 | Work proceeds phase by phase. A phase starts only after the previous one is validated. |
| C9 | Important architectural and ML decisions are explained. Important functionality has tests. |
| C10 | The MVP is strictly text-only. |
| C11 | The UI follows a minimal, brutalist-inspired design system. |
| C12 | Frontend and backend work starts only after the model is validated. |

**Downloading open datasets is allowed.** Datasets are text, not models, and fetching them from a dataset host is not inference.

## Environment

Measured on the owner's machine on 2026-11-02:

- Apple M4 (10 CPU cores, 10 GPU cores) with 16 GB unified memory and no NVIDIA GPU.
- 234 GB free on the project volume.
- Training and inference both run on this Mac only.
- English only.

## Users and goals

There is one user: the owner, on their own machine, with no accounts or login.

| Goal | Evidence that it is met |
|---|---|
| G1. Understand each stage of a language model | Every module is hand-written, tested, and explained |
| G2. Train a model end to end | A reproducible run produces a checkpoint from random weights |
| G3. Chat with that model in a browser | Streaming chat works end to end with saved history |

## Functional requirements (MVP)

### Model pipeline

- **F1** Download, clean, deduplicate, and split datasets with one repeatable command per stage.
- **F2** Train and use a project-written BPE tokenizer with lossless encode/decode.
- **F3** Implement a GPT-style Transformer in PyTorch without using a pre-built model class.
- **F4** Pre-train it on plain text, with resumable checkpoints.
- **F5** Fine-tune the pre-trained weights on instruction and conversation data.
- **F6** Evaluate every candidate using the same held-out data and fixed prompt set.
- **F7** Generate text with temperature, top-k, top-p, repetition penalty, and stop tokens.

### Chat application

- **F8** Create, list, open, rename, and delete conversations.
- **F9** Send a message and see the reply stream token by token.
- **F10** Stop a reply in progress and keep the partial text.
- **F11** Persist conversations and messages across restarts in SQLite.
- **F12** Title a new conversation from the start of its first message.
- **F13** Show a clear error when the model is busy, missing, or fails.
- **F14** Show permanently that the model is small and can be wrong.
- **F15** Change temperature, top-k, top-p, and maximum reply length in a settings panel, and reset them to defaults.

## Non-functional requirements

| ID | Requirement |
|---|---|
| N1 | **Local only.** Services bind to `127.0.0.1`. Chat data never leaves the machine. |
| N2 | **Offline serving.** Once a checkpoint exists, chatting needs no network. |
| N3 | **Memory.** Training must leave the Mac usable. The measured figure for the chosen model is in [AI_MODEL.md](AI_MODEL.md#measured-on-this-mac). |
| N4 | **Interruptible.** Training resumes from its latest checkpoint after a crash or sleep. |
| N5 | **Reproducible.** Each run records its config, seed, data hashes, and git commit. |
| N6 | **Tested.** Every phase has automated checks and a validation gate. |
| N7 | **Honest.** Metrics come from real runs. Nothing is estimated and reported as measured. |

Latency targets are not set yet. Phase 7 measures real generation speed on real weights, and targets are recorded only then.

## Expected quality

This section sets expectations that the brief's "answers basic questions" could otherwise overstate.

| Capability | Realistic expectation at about 17M parameters |
|---|---|
| Text generation | Grammatical, simple English is the likely strength |
| Instruction format | Should learn to reply to a prompt and stop at the right point |
| Basic questions | Answers should look like answers. **Facts will often be wrong or invented**, because the model memorises little and has no lookup |
| Conversation | Short exchanges. Limited memory of context and weak reasoning |
| Maths, code, long reasoning | Not expected to work |

The brief's outcome is therefore judged by measurement, using the evaluation suite in [AI_MODEL.md](AI_MODEL.md#evaluation). Pass thresholds are set after the first real result, then frozen before the final run. If the measured quality disappoints, the options are to train longer, use more or better data, or try a bigger model. Pre-trained models stay excluded by C2.

## Out of scope for the MVP

Accounts or authentication, cloud deployment, RAG or document upload, web search, agents and tools, any image, voice, or file input or output, multiple model selection in the UI, regenerate or edit-message, Markdown rendering, conversation search, chat export, Docker, mobile apps, non-English languages, and comparison against third-party models.

Any of these can be proposed after Phase 10.

## Open decisions

These need the owner's answer. Recommended defaults are already written into the plan and apply unless the owner chooses otherwise.

| ID | Decision | Recommended default | Needed by |
|---|---|---|---|
| D1 | Allow TinyStories? It is text that GPT-3.5 and GPT-4 generated. No AI API or AI model is used by this project, but the owner may consider it against the spirit of C1 and C2. | Allow, and disclose it | Phase 2 |
| D2 | Remove the starter's `apps/docs` and `packages/ui`, which this project does not need? | Remove | Phase 1 |
| D3 | Tokenizer: project-written BPE, or the SentencePiece library the brief also mentions? | Project-written BPE, which best satisfies C4 and G1 | Phase 3 |
| D4 | Share-alike licences on Dolly and Simple Wikipedia are acceptable for private use, but publishing the weights later would need a licence review. Accept this? | Accept, and keep the weights private | Phase 2 |

## Success criteria

The MVP is complete when all of these are true:

1. A checkpoint trained from random weights by this repo is the one serving chat.
2. A dependency check shows no external AI SDK or pre-trained model loader in the project.
3. All Phase 10 checks pass, and the evaluation report is saved with real numbers.
4. The owner has chatted with the model in the browser, stopped a reply, restarted the app, and found the history intact.
