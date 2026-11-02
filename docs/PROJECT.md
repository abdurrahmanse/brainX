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

## How it is used

1. **Chat:** open the app, type a question, watch the reply stream, and press Stop if needed.
2. **Continue:** send a follow-up in the same chat. The model sees the earlier messages that fit in its 512-token window.
3. **Come back:** reload or restart. The history list shows earlier chats, and you can open or delete one.
4. **Adjust:** open the settings panel, change temperature or reply length, and reset to the defaults.
5. **Recover:** if the model, server, or database is unavailable, the app says so and works again once the problem is fixed.

## Non-functional requirements

| Area | Requirement | Checked in |
|---|---|---|
| Privacy | Everything stays on this Mac. The API listens on 127.0.0.1, and logs never contain prompts or replies. | P5-T15, P5-T16, P8-T2 |
| Offline | Chat works without internet once set up. | P8-T2 |
| Reproducibility | Each training run records its config, seed, git commit, and data hashes. | P3-T4, P3-T5 |
| Honesty | Every reported number comes from a real run. | `AGENTS.md`, every task report |
| Accessibility | Keyboard use, WCAG AA contrast, and no sideways scrolling at 375px. | P6-T14, P6-T15 |
| Performance | No target is set until it is measured on real weights. | P4-T6, P5-T18, P7-T1 |
| Quality | Tests, linting, and type checks pass. | P8-T1 |

## MVP acceptance map

| # | MVP feature | Built in | Checked in |
|---|---|---|---|
| 1 | Streaming reply | P5-T11, P6-T11 | P7-T1, P7-T3 |
| 2 | Stop keeps the partial text | P5-T12, P6-T7, P6-T11 | P7-T1, P7-T3 |
| 3 | Follow-ups use earlier messages | P5-T11, P6-T12 | P7-T1 |
| 4 | Markdown, code blocks, copy | P6-T6, P6-T8, P6-T9 | P6-T16 |
| 5 | New chat and collapsible sidebar | P6-T5 | P7-T1 |
| 6 | History: reopen and delete | P5-T8, P5-T9, P6-T12 | P7-T1, P7-T3 |
| 7 | Light and dark theme | P6-T10 | P8-T3 |
| 8 | Settings panel | P5-T13, P6-T13 | P7-T1 |
| 9 | Responsive, keyboard, accessible | P6-T14, P6-T15 | P8-T3 |
| 10 | Loading, empty, and error states | P5-T14, P6-T4, P6-T11 | P7-T2 |

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
