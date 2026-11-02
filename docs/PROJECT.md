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
| Deployment | Public portfolio deployment after local validation; hosting provider is chosen only after real CPU inference measurements |

## MVP features

**Chat**

1. Send a text message and see the reply stream as it's generated.
2. Stop a reply and keep its partial text.
3. Continue a conversation, with earlier messages sent as context.
4. Show replies as Markdown, with highlighted code blocks and a copy button.

**Conversations**

5. Start a new chat from a collapsible sidebar.
6. Reopen or delete earlier conversations from the history list, saved in PostgreSQL.

**Accounts**

7. Register, log in, and log out with an email and password.
8. See only your own conversations and messages.

**Experience**

9. Choose a light or dark theme.
10. Change generation settings in a basic settings panel.
11. Use the app on desktop and mobile, with keyboard shortcuts and accessible dialogs.
12. See consistent loading, empty, and error states, including toast notifications.

## Not in the MVP

Payments, image generation, voice, file upload, web search, email verification, password reset, renaming chats, Redis, and background job queues.

## How it is used

1. **Account:** register or log in, then receive an authenticated browser session.
2. **Chat:** open the app, type a question, watch the reply stream, and press Stop if needed.
3. **Continue:** send a follow-up in the same chat. The model sees the earlier messages that fit in its 512-token window.
4. **Come back:** reload or restart. The history list shows only the signed-in user's earlier chats, which they can open or delete.
5. **Adjust:** open the settings panel, change temperature or reply length, and reset to the defaults.
6. **Recover:** if the model, server, or database is unavailable, the app says so and works again once the problem is fixed.

## Non-functional requirements

| Area | Requirement | Checked in |
|---|---|---|
| Privacy | Production logs never contain passwords, prompts, or replies. Secrets stay in the host's secret store, never in git. | P5-T15, P5-T16, P8-T6 |
| Offline | The local development build works without internet once set up. The public deployment naturally requires an internet connection. | P8-T2 |
| Accounts | Passwords are stored only as strong hashes; authenticated users can access only their own data. | P5-T6A, P5-T16, P7-T4 |
| Public safety | Production uses HTTPS, secure cookies, an allow-list CORS policy, request limits, and a documented one-generation capacity limit. | P5-T6A, P5-T16, P8-T6 |
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
| 7 | Register, log in, log out | P5-T6A, P6-T4A | P7-T4 |
| 8 | Per-user conversation access | P5-T6, P5-T8 | P7-T4 |
| 9 | Light and dark theme | P6-T10 | P8-T3 |
| 10 | Settings panel | P5-T13, P6-T13 | P7-T1 |
| 11 | Responsive, keyboard, accessible | P6-T14, P6-T15 | P8-T3 |
| 12 | Loading, empty, and error states | P5-T14, P6-T4, P6-T11 | P7-T2 |

## Definition of finished

- A model trained in this repo answers in the browser, with no internet connection.
- Replies stream, and follow-up messages include earlier context.
- A registered user can log in and can never read or change another user's conversation.
- Tests pass, and evaluation results come from real runs.
- The README explains setup, results, limits, and the live portfolio URL for a portfolio reader.

## Expected model quality

These are expectations, not results, because no training has run yet.

- **Likely:** simple English sentences and replies in the right format.
- **Often wrong:** facts, because a small model remembers little and cannot look anything up.
- **Not expected:** maths, code, or long reasoning.

## Public deployment boundary

The model is trained and evaluated locally first. Public deployment happens only after P4-T6 measures real CPU inference speed and memory, because a small hosted CPU service may be slower than this Mac. The hosting provider, domain, budget, and production environment are deliberately not chosen in advance. P8-T6 makes that choice from measured requirements, deploys with secrets outside git, and records the real URL and limitations.

The initial public version remains **English only**. Bengali support would require a different data, tokenizer, and evaluation decision before P2-T3; it is not implied merely by a Bengali user interface.

## Working rules

- Tasks and their order: [TASKS.md](TASKS.md)
- Current state: [PROGRESS.md](PROGRESS.md)
- How agents must work: [AGENTS.md](../AGENTS.md)
