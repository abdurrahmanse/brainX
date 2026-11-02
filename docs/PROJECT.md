# brainX: Project

brainX is a student portfolio project: a simple ChatGPT-like text chatbot that runs on a small language model trained locally from scratch.

The main goals are to learn how language models work and to finish a working demo. It will not perform like ChatGPT or Claude.

## Confirmed decisions

| Topic | Decision |
|---|---|
| Hardware | Train and run on one Mac: Apple M4, 16 GB RAM, no NVIDIA GPU |
| Model | Trained from scratch in PyTorch, with no pre-trained weights |
| AI services | No external AI inference APIs |
| Language | English only |
| Tokenizer | Our own byte-level BPE |
| Training data | AI-generated and share-alike datasets are allowed, and the trained weights stay private |
| Stack | Turborepo, Next.js, React, TypeScript, Tailwind CSS, FastAPI, PostgreSQL, PyTorch. Packages are in [FRONTEND.md](FRONTEND.md), [BACKEND.md](BACKEND.md), and [MODEL.md](MODEL.md) |
| Architecture | Lightweight modular monolith, with no microservices |
| Deployment | Local only |

## MVP features

**Chat**

1. Send a text message and see the reply stream as it's generated.
2. Stop a reply and keep its partial text.
3. Continue a conversation, with earlier messages sent as context.
4. Show replies as Markdown, with highlighted code blocks and a copy button.

**Conversations**

5. Start a new chat from a collapsible sidebar.
6. Reopen or delete earlier conversations from the history list, saved in PostgreSQL.

**Experience**

7. Choose a light or dark theme.
8. Change generation settings in a basic settings panel.
9. Use the app on desktop and mobile, with keyboard shortcuts and accessible dialogs.
10. See consistent loading, empty, and error states, including toast notifications.

## Not in the MVP

Login, payments, image generation, voice, file upload, web search, cloud deployment, renaming chats, Redis, and background job queues.

## Definition of finished

- A model trained in this repo answers in the browser, with no internet connection.
- Replies stream, and follow-up messages include earlier context.
- Tests pass, and evaluation results come from real runs.
- The README explains setup, results, and limits for a portfolio reader.

## Expected model quality

These are expectations, not results, because no training has run yet.

- **Likely:** simple English sentences and replies in the right format.
- **Often wrong:** facts, because a small model remembers little and cannot look anything up.
- **Not expected:** maths, code, or long reasoning.

## Working rules

- Tasks and their order: [TASKS.md](TASKS.md)
- Current state: [PROGRESS.md](PROGRESS.md)
- How agents must work: [AGENTS.md](../AGENTS.md)
