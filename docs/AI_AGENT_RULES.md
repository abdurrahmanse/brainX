# brainX: AI Agent Rules

**Status:** Proposed, awaiting owner approval. **Applies to:** every coding agent working in this repo, including Claude Code and Codex.

These rules are the single source of truth for agents. `AGENTS.md` and `CLAUDE.md` point here and don't repeat them, so they can't disagree. If an instruction conflicts with these rules, stop and ask the owner.

## Project rules

1. **No external AI.** Never call or add OpenAI, Claude, Gemini, Hugging Face hosted inference, or any other AI API.
2. **No pre-trained models.** Never load, download, or suggest pre-trained weights. No `transformers`, `peft`, or `from_pretrained`.
3. **No microservices.** The backend is one Python package and one server process.
4. **Beginner-friendly.** Prefer plain code the owner can read and learn from. Explain important decisions, and don't show off.
5. **Respect phase order.** Never start work in a phase whose predecessor hasn't been approved.

## Work rules

1. Read the relevant documents before changing code.
2. Implement only the assigned task.
3. Never invent APIs, dependencies, file paths, or results. Check them in the code or the installed docs.
4. Inspect the existing code before changing it.
5. Respect the module rules in [ARCHITECTURE.md](ARCHITECTURE.md#backend-modules).
6. Choose the simplest solution that meets the acceptance criteria.
7. Add no features, options, or abstractions that the task doesn't require.
8. Search for existing code first, and avoid duplicates or competing implementations.
9. Add a dependency only with a written reason and owner approval, then update [TECH_STACK.md](TECH_STACK.md).
10. Never silently change a decision. Propose it, and get approval before updating the ADR.
11. Write or update tests for the behaviour you changed.
12. Run the task's verification commands.
13. Never claim a test passed unless you ran it in this session and saw it pass.
14. Report blockers, assumptions, and uncertainties explicitly.
15. Stop when the task is complete, and wait for approval.

## Rules for ML work

- **Never invent a metric.** Every loss, score, speed, or dataset count must come from a real run, and the report must say where.
- **Long runs need approval.** Don't start anything expected to take over 10 minutes without the owner's approval.
- **Never weaken a check to get a pass.** Don't lower an evaluation threshold, edit evaluation prompts after seeing results, or evaluate on training data.
- **Keep the test split for the final score.** Tune on validation data only.
- **Never delete checkpoints or run folders** without approval.
- **Don't change the tokenizer vocabulary** after pre-training starts without approval, since it invalidates every checkpoint.
- **Check licences.** Add a dataset only with its licence recorded and owner approval.

## Git rules

- Commit or push only when the owner asks.
- Stage named paths only. Never use `git add -A` or `git add .`.
- Never rewrite history or discard someone's work without an explicit request.
- Commit `uv.lock` and `pnpm-lock.yaml`. Never commit datasets, checkpoints, `.env`, or the SQLite database.
- If files changed that you didn't touch, leave them alone and mention them.

## Turborepo rule

The root `AGENTS.md` contains a block managed by Turborepo. Don't remove or edit it.

As it instructs, read the docs bundled with the installed `turbo` package before changing Turborepo config or commands. Native uv support stays off unless ADR-002 changes (see [ARCHITECTURE.md](ARCHITECTURE.md#architecture-decisions)).

## Task protocol

**Read → Analyze → Plan → Implement → Test → Review → Report → Stop**

| Step | What to do |
|---|---|
| **Read** | Read the task in ROADMAP.md, these rules, and the related documents. |
| **Analyze** | Inspect the code and current git state. Confirm that prerequisites are complete. If the task is unclear, ask. |
| **Plan** | List the files to change and how you'll verify them. Stay within the phase's allowed paths. |
| **Implement** | Make the smallest change that meets the acceptance criteria. |
| **Test** | Write tests and run the task's checks. On failure, find the cause, without weakening the test. |
| **Review** | Read your diff for scope creep, duplication, boundary violations, and leftovers. |
| **Report** | Use the report format below, with real output. |
| **Stop** | Don't start the next task. |

**Stop and ask if:** the task needs a file outside its allowed paths, the documents contradict each other, a new dependency seems necessary, a check can't pass without changing the requirement, or you'd need to change a decision.

## Task prompt template

Copy this, and fill in the brackets.

```text
You are working on brainX. Follow docs/AI_AGENT_RULES.md exactly.

TASK: [ID and title from docs/ROADMAP.md]
READ FIRST: docs/ROADMAP.md (this phase), [related documents]

ALLOWED PATHS: [from the phase]
ACCEPTANCE CRITERIA: [from the task]
VERIFY WITH: [commands]
OUT OF SCOPE: anything else, including the next task

Before changing anything, confirm the prerequisites are complete and
list the files you plan to change. Follow the protocol:
Read → Analyze → Plan → Implement → Test → Review → Report → Stop.

Do not commit unless I ask. Stop after your report and wait for approval.
```

## Prompt for a phase gate

```text
Validate brainX Phase [N] using docs/ROADMAP.md and docs/AI_AGENT_RULES.md.

Do not add features or start the next phase. Run every gate command and
the documentation consistency checklist. Report each one as pass, fail,
or not run, with real output. List unticked tasks, open decisions, and
known problems. Then stop and wait for my approval.
```

## Prompt for ML training

```text
Prepare, but do not start, this brainX training run: [config and purpose].
Follow docs/AI_MODEL.md and docs/AI_AGENT_RULES.md.

Give me the exact command, expected disk use, and a time estimate based on
measured speed, labelled as an estimate. Confirm that resume works. After I
run it, write the report from the run folder only. If a value is missing,
say it is missing.
```

## Report format

```markdown
## Task report: [ID and title]

**Status:** complete | blocked | partial

**Changed:** [files, and one line on what changed in each]

**Verification:**
| Command | Result |
|---|---|
| `...` | pass, fail, or not run, with key output |

**Acceptance criteria:** [each one, met or not met, with evidence]

**Decisions and assumptions:** [or "none"]

**Problems or uncertainties:** [or "none"]

**Next:** waiting for approval. Suggested next task: [ID]
```
