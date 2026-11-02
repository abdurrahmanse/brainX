# brainX: Model

No training has run yet, so this file contains **no model results**. Phase 2 confirms these plans before any training starts.

## Pipeline

```mermaid
flowchart LR
    A[Datasets] --> B[Clean and split]
    B --> C[Train tokenizer]
    C --> D[Pre-train]
    D --> E[Fine-tune]
    E --> F[Evaluate]
    F --> G[Chat]
```

- **Pre-training** teaches English from plain text.
- **Fine-tuning** then teaches a behaviour on the same weights: reply to a user, then stop.

## Strategy

| Option | Benefit | Cost | Status |
|---|---|---|---|
| Train from scratch | Most learning, and the model is fully yours | Simple answers, and facts are often wrong | **Chosen** |
| Fine-tune an open-weight model | Likely better answers | You would not build the core model | Not used |

## Measured on this Mac

A temporary test ran on the M4 with PyTorch 2.15.0, using 40 seconds per size. All sizes used 8,000 tokens.

| Size | Context | Dim | Layers | Parameters | Weights | Train speed (MPS) | Reply speed (CPU) | Reply speed (MPS) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 256 | 256 | 6 | 6.8M | 27 MB | 26,524 tokens/s | 1,049 tokens/s | 58 tokens/s |
| **M (recommended)** | 512 | 384 | 8 | 17.4M | 70 MB | 12,332 tokens/s | 509 tokens/s | 175 tokens/s |
| L | 512 | 512 | 10 | 35.8M | 143 MB | 7,101 tokens/s | 302 tokens/s | 279 tokens/s |

Size M used about 5.5 GB of GPU memory at the moment measured. At its measured speed, 8 hours would be about 355M tokens.

**Limits of these numbers:**

- They used random data and random weights, with no data loading or evaluation time.
- Short runs can't show slowdown from heat, so long runs may be slower.
- The S result on MPS looks too low and was not explained.
- Mixed precision showed no clear gain over float32 (12,201 against 12,027 tokens/s in a 25-second run), so training plans to use float32.

## Data

Plans from dataset pages, checked on 2026-11-02. P2-T2 confirms licences before anything is downloaded.

| Dataset | Rows | Licence tag | Use |
|---|---:|---|---|
| `roneneldan/TinyStories` | 2,141,709 | CDLA-Sharing-1.0 | Simple English for pre-training; written by GPT-3.5 and GPT-4 |
| `rahular/simple-wikipedia` | 769,764 | **None; must be confirmed** | Factual text for pre-training |
| `databricks/databricks-dolly-15k` | 15,011 | CC-BY-SA-3.0 | Questions and instructions for fine-tuning |
| `OpenAssistant/oasst1` | 88,838 messages | Apache-2.0 | Conversations for fine-tuning |

**Data rules:**

- Keep OASST1 rows that are English, not deleted, passed review, and not synthetic. Its train split has 39,283 English messages before the other filters.
- Remove empty rows and exact duplicates, and split deterministically into train, validation, and test.
- Share-alike licences are fine for private weights. Publishing the weights later would need a licence review.

## Tokenizer

We write byte-level BPE ourselves, with a vocabulary of 8,000 tokens.

**Example:** if `t` and `h` often appear together, BPE merges them into a new token `th`. Starting from bytes means any text can be encoded and decoded exactly.

**Special tokens:** `<|pad|>`, `<|bos|>`, `<|eos|>`, `<|user|>`, `<|assistant|>`, `<|end|>`

**Chat format:**

```text
<|bos|><|user|>What is rain?<|end|><|assistant|>Rain is water from clouds.<|end|>
```

The vocabulary is fixed before pre-training, because changing it later would make the checkpoints useless.

## Model

A GPT-style decoder-only Transformer, written by hand. Size M is the recommendation until P2-T1 confirms it.

| Part | Value |
|---|---|
| Vocabulary / context | 8,000 tokens / 512 tokens |
| Dimension / layers / heads | 384 / 8 / 8 |
| Feed-forward size | 1,536 |
| Positions | Learned position embeddings |
| Normalisation | LayerNorm before attention and feed-forward |
| Output layer | Shares weights with the token embedding |
| Parameters | 17,437,440 |

## Training starting values

These are starting points to test, not proven settings.

| Setting | Pre-training | Fine-tuning |
|---|---|---|
| Device | MPS, float32 | MPS, float32 |
| Batch | 16 × 512 tokens | Chosen in P3-T6 |
| Optimiser | AdamW | AdamW |
| Peak learning rate | 3e-4 | 5e-5 |
| Gradient clipping | 1.0 | 1.0 |
| Loss | All tokens | Assistant tokens only |

**Reproducibility:** each run saves its config, seed, git commit, and metrics beside its checkpoint. Results on MPS may still differ slightly between runs.

**Long runs:** checkpoints must allow resuming. Use `caffeinate -i` so the Mac doesn't sleep.

## Evaluation

| Check | Passes when |
|---|---|
| Starting loss | Close to ln(8000) ≈ 8.99 |
| Overfit one small batch | Loss becomes very small |
| Bigram baseline | The model has lower validation loss |
| Pre-trained against fine-tuned | Fine-tuned does better on fixed prompts |

Write about 30 fixed prompts before training: text generation, basic questions, and short conversations. Save the raw outputs, so every score can be checked.

## Inference

| Setting | Starting value |
|---|---|
| Device | CPU, which was faster for size M in the test; P4-T5 re-checks with real weights |
| Temperature | 0.8 |
| Top-k / top-p | 40 / 0.95 |
| Repetition penalty | 1.1 |
| Max new tokens | 200 |
| Stop | `<\|end\|>` or `<\|eos\|>` |

**Context:** 512 tokens minus 200 for the reply leaves 312 for the conversation. Older messages get dropped when it doesn't fit, so the model forgets them.

## Limits

The model can invent facts confidently, forget long conversations, and repeat problems from its data. It has no safety training. The UI states that its answers can be wrong.
