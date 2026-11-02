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
| Stack | Turborepo, Next.js, React, TypeScript, Tailwind CSS, FastAPI, PyTorch |
| Architecture | Lightweight modular monolith, with no microservices |
| Deployment | Local only |

## MVP features

1. Send a text message and get a reply.
2. See the reply stream as it is generated.
3. Continue a conversation, with earlier messages sent as context.
4. Use a Minimalist + Neo-Brutalist interface.

## Not in the MVP

Chat history after a refresh or restart (SQLite), login, a settings panel, renaming chats, file upload, images, voice, web search, and cloud deployment.

SQLite gets added only if chat history is approved later.

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
