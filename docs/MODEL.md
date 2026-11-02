# brainX: Model

No training has run yet, so this file contains **no model results**. Measured numbers come from short tests with random data.

## Confirmed strategy

**Train a small decoder-only Transformer from scratch.** The owner approved this on 2026-11-02. No pre-trained weights are used, and fine-tuning means instruction-tuning our own pre-trained model.

| Topic | A: From scratch (chosen) | B: Fine-tune an open-weight model |
|---|---|---|
| Data needed | Much more | Less |
| Expected quality | Simple, and facts are often wrong | Usually much better |
| Complexity | Higher: tokenizer, model, and training are all ours | Lower |
| Size on this Mac | **6.8M parameters (size S, chosen)**; MPS memory will be measured in P3-T6 | For example SmolLM2-135M, 134.5M parameters; not tested here |
| Compute time | Not estimated for size S yet; P3-T6 records a real smoke-test measurement | Not tested here |
| Reproducibility | Same code, data, and config; MPS results may differ slightly | Also depends on the base model version |
| Learning value | Highest | Lower for model internals |
| Local inference | Runs through our own code | Would need more libraries |

These expectations are not results. The model will not perform like ChatGPT or Claude.

## Hardware

Checked on 2026-11-02: Apple M4, 16 GB unified memory (68% free during the check), 234 GB free disk, and no NVIDIA GPU. PyTorch's MPS backend was available in a test.

| Size | Context | Dim | Layers | Parameters | Weights | Train speed (MPS) | Reply speed (CPU) | Reply speed (MPS) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| **S (confirmed)** | 256 | 256 | 6 | 6.8M | 27 MB | 26,524 tokens/s | 1,049 tokens/s | 58 tokens/s |
| M (not selected) | 512 | 384 | 8 | 17.4M | 70 MB | 12,332 tokens/s | 509 tokens/s | 175 tokens/s |
| L | 512 | 512 | 10 | 35.8M | 143 MB | 7,101 tokens/s | 302 tokens/s | 279 tokens/s |

All sizes used 8,000 tokens. The 5.5 GB Size M memory result is only a prior short benchmark and does not describe selected size S. P3-T6 will measure size S with real data.

**Limits of these numbers:**

- They used random data and weights for 40 seconds, with no data loading or evaluation time.
- Heat can slow long runs, which a short test can't show.
- The S result on MPS looks too low, and it wasn't explained.

**Mixed precision:** `torch.autocast` ran on MPS, but showed no clear gain (float16: 12,201; bfloat16: 11,753; float32: 12,027 tokens/s, in 25-second runs on one repeated batch). Training plans to use float32, and P3-T6 may re-check this on real data.

## Folder structure

This structure exists as empty placeholders, created at the owner's request (the one exception to "create files only in their task"). Each file gets its content only in the task that needs it. Not created yet: `model/src/__init__.py` (P1-T6), `model/configs/eval_prompts.jsonl` (P3-T8), and the `tests/` files.

```text
model/
├── notebooks/
│   ├── 01_dataset_exploration.ipynb
│   ├── 02_data_preprocessing.ipynb
│   ├── 03_tokenizer.ipynb
│   ├── 04_model_architecture.ipynb
│   ├── 05_model_training.ipynb
│   ├── 06_model_evaluation.ipynb
│   └── 07_inference_testing.ipynb
├── src/
│   ├── __init__.py       # makes `from src.inference import ...` work
│   ├── data.py
│   ├── tokenizer.py
│   ├── model.py
│   ├── train.py
│   ├── evaluate.py
│   └── inference.py
├── configs/
│   └── training.yaml
├── data/                 # not in git
├── checkpoints/          # not in git
├── outputs/              # not in git
├── tests/
└── pyproject.toml
```

`__init__.py` is the one addition to the owner's structure. A temporary test confirmed that FastAPI can import from `model/src` this way.

## Packages

Installed in P1-T6 and P2-T1: `pytest`, `torch`, `jupyterlab`, `ipykernel`, and `psutil`. The remaining packages resolved together on Python 3.13 on 2026-11-02, but each is added only in its own approved task.

| Status | Package | Version | Purpose | First used |
|---|---|---:|---|---|
| Required | `torch` | 2.15.0 | Model and training | P2-T1 |
| Required | `jupyterlab`, `ipykernel` | 4.6.5, 7.4.0 | Notebooks | P2-T1 |
| Required | `psutil` | 7.2.2 | Memory and hardware checks | P2-T1 |
| Required | `pytest` | 9.2.0 | Tests | P1-T6 |
| Required | `datasets` | 5.1.0 | Download datasets; brings `pyarrow` 26.0.0 | P2-T4 |
| Required | `pandas`, `numpy` | 3.1.0, 2.5.4 | Analysis and token files | P2-T5 |
| Required | `matplotlib` | 3.11.2 | Plots | P2-T5 |
| Required | `regex` | 2026.9.29 | Splitting text for BPE | P2-T8 |
| Required | `pyyaml` | 6.0.3 | Read `training.yaml` | P3-T3 |
| Required | `tqdm` | 4.70.1 | Progress bars | P3-T4 |
| Optional | `ftfy` | 6.3.1 | Fix broken text, if P2-T5 finds it | P2-T6 |
| Optional | `ipywidgets` | 8.1.9 | Nicer notebook progress bars | When wanted |
| Optional | `tensorboard` | 2.21.0 | Live charts, if notebook plots aren't enough | When wanted |
| Optional | `safetensors` | 0.8.0 | Safer weight file for export | P4-T7 decides |
| Hardware-dependent | `pynvml`, `bitsandbytes` | 13.0.1, 0.50.2 | NVIDIA tools; there's no NVIDIA GPU here | Not used |
| Not needed | `transformers`, `peft`, `trl`, `accelerate` | | Pre-trained model tools; not used in approach A | |
| Not needed | `tokenizers` | | Our tokenizer is hand-written | |
| Not needed | `scipy`, `scikit-learn`, `plotly` | | NumPy, pandas, and matplotlib cover the need | |
| Not needed | `evaluate`, `rouge-score`, `sacrebleu` | | BLEU and ROUGE need reference answers, and suit translation and summaries more than free chat | |

## Datasets

Facts below came from Hugging Face on 2026-11-02. Licence tags are what each page declares, and this isn't legal advice. P2-T3 records the exact versions.

| Dataset | Rows | Licence tag | Use | Limits |
|---|---:|---|---|---|
| `roneneldan/TinyStories` | 2,141,709 | CDLA-Sharing-1.0 | Simple English for pre-training | Written by GPT-3.5 and GPT-4; children's-story style |
| `wikimedia/wikipedia`, config `20231101.simple` | 241,787 | CC-BY-SA-3.0, GFDL | Factual text for pre-training | Share-alike; articles need cleaning |
| `databricks/databricks-dolly-15k` | 15,011 | CC-BY-SA-3.0 | Instruction fine-tuning | Small; share-alike |
| `OpenAssistant/oasst1` | 88,838 messages | Apache-2.0 | Conversation fine-tuning | Many languages; few English conversation starters |

**OASST1 filter:** English, not deleted, passed review, and not synthetic. Its train split has 39,283 English messages from 3,482 conversation starters before the other filters.

**Rejected:**

- `rahular/simple-wikipedia`: no licence tag.
- `li2017dailydialog/daily_dialog` and `HuggingFaceH4/no_robots`: non-commercial tags.

`allenai/soda` (1,486,896 rows, CC-BY-4.0) stays in reserve if conversation quality is weak.

**Subset first:** every step starts with a small subset, sized in P2-T4. The full data is used only after the smoke test passes.

**Data rules:** remove empty rows and exact duplicates. Split by a hash of the text, so that splits stay stable and duplicates can't leak across them. Save row counts and hashes in a manifest. Share-alike licences are acceptable while the weights stay private.

## Tokenizer

We write byte-level BPE ourselves, with a vocabulary of 8,000 tokens.

**Example:** if `t` and `h` often appear together, BPE merges them into a new token `th`. Starting from bytes means any text can be encoded and decoded exactly.

**Special tokens:** `<|pad|>`, `<|bos|>`, `<|eos|>`, `<|user|>`, `<|assistant|>`, `<|end|>`

**Chat format:**

```text
<|bos|><|user|>What is rain?<|end|><|assistant|>Rain is water from clouds.<|end|>
```

The vocabulary is fixed before pre-training, because changing it later would make checkpoints useless.

## Model

A GPT-style Transformer, written by hand. Values below are for confirmed size S; P3-T1 verifies the detailed architecture and exact parameter count.

| Part | Value | Why |
|---|---|---|
| Vocabulary / context | 8,000 / 256 tokens | Enough for short chats on size S |
| Dimension / layers / heads | 256 / 6 / 8 | Chosen size S configuration |
| Feed-forward size | 1,024 | Four times the dimension, as in GPT-2 |
| Positions | Learned embeddings | Easy to understand |
| Normalisation | LayerNorm before attention and feed-forward | Stable training |
| Attention | Causal, so tokens can't see later tokens | Required for predicting the next token |
| Output layer | Shares weights with the token embedding | Saves parameters |
| Parameters | About 6.8M | P3-T1 calculates and confirms the exact count |

## Training pipeline

**Pre-training** teaches English from plain text. **Fine-tuning** then teaches a behaviour on the same weights: reply to a user, then stop.

These are starting values to test, and they live in `configs/training.yaml`.

| Setting | Pre-training | Fine-tuning |
|---|---|---|
| Device / precision | MPS, float32 | MPS, float32 |
| Batch | 16 × 256 tokens | Starting point; P3-T6 measures memory and speed |
| Gradient accumulation | 1, raised if memory is short | 1 |
| Optimiser | AdamW | AdamW |
| Peak learning rate | 3e-4, with warm-up then cosine decay | 5e-5 |
| Gradient clipping | 1.0 | 1.0 |
| Loss | All tokens | Assistant tokens only |

**Reliability:**

- **Device detection:** choose MPS, then CPU, and log which one is used.
- **Checkpoints:** save weights, optimiser, step, and random state to a temporary file, then rename it, so a crash can't corrupt `latest`. Also keep `best`.
- **Recovery:** resume from `latest` after a crash or sleep.
- **Out of memory:** stop with a clear message that suggests a smaller batch and accumulation. Don't silently change settings.
- **Bad loss:** stop if the loss becomes NaN.
- **Sleep:** run long jobs with `caffeinate -i`.

**Where files go:** training checkpoints are saved in `model/checkpoints/<run-name>/`, run records in `model/outputs/runs/<run-name>/`, and the exported model for the backend in `model/checkpoints/export/`. All three are ignored by git.

**Experiment tracking:** each run gets `model/outputs/runs/<name>/` with its config, seed, git commit, dataset hashes, `metrics.jsonl`, and sample outputs. MPS results may still differ slightly between runs.

**Distributed training:** not used, because there's one machine.

## Notebook workflow

Notebooks explore and explain. Reusable logic lives in `model/src/`, and **full training runs in a terminal with `train.py`**, because a closed notebook kernel could lose hours of work.

| Notebook | Covers | Main code |
|---|---|---|
| `01_dataset_exploration` | Schema, examples, missing values, lengths, language share, duplicates, charts | `data.py` |
| `02_data_preprocessing` | Cleaning, normalising, duplicates, conversation format, splits, leakage check | `data.py` |
| `03_tokenizer` | Training BPE, special tokens, token lengths, encode/decode | `tokenizer.py` |
| `04_model_architecture` | Structure, parameters, memory estimate, forward pass, causal check | `model.py` |
| `05_model_training` | Config, seeds, device, smoke test, loss charts | `train.py` |
| `06_model_evaluation` | Held-out loss, perplexity, fixed prompts, baseline, repeated and wrong answers, speed, memory | `evaluate.py` |
| `07_inference_testing` | Generation, temperature and top-p, stopping, multi-turn, speed, export | `inference.py` |

**Each notebook has:** title and objective, dependencies, dataset description, clear Markdown, organised cells, a config cell with the seed, input checks, expected outputs, useful charts, results and interpretation, limitations, and next steps.

**Keep notebooks small:** no huge cells or copied logic. Clear bulky outputs before committing, and save large outputs to `model/outputs/`.

## Evaluation

Measured results and subjective observations are reported separately.

| Measured | How |
|---|---|
| Training and validation loss | `metrics.jsonl` |
| Perplexity | From held-out loss, on the same tokenizer and data |
| Bigram baseline | A simple counting model that the Transformer must beat |
| Repetition | Rate of repeated n-grams in generated text |
| Stopping | Share of replies that end with a stop token |
| Speed and memory | Tokens per second and peak memory on real weights |

| Reviewed by a person | How |
|---|---|
| Relevance and coherence | Score 0-2 on fixed prompts |
| Multi-turn behaviour | Does a follow-up use the earlier turn? |
| Hallucination | Record example wrong or invented answers |

**Correctness checks before training:** starting loss near ln(8000) ≈ 8.99, and one small batch can overfit.

**Fixed prompts:** write about 30 in `model/configs/eval_prompts.jsonl` before the full run, covering text generation, basic questions, and short conversations. Save raw outputs, so that every score can be checked.

**Comparison:** run the bigram baseline, the pre-trained model, and the fine-tuned model with the same prompts, seed, and default settings. Pass thresholds are set after the first real result, then kept fixed.

## Inference and backend integration

| Setting | Starting value |
|---|---|
| Device | CPU or MPS is chosen from P4-T6 measurements with real size S weights |
| Temperature | 0.8 |
| Top-k / top-p | 40 / 0.95 |
| Repetition penalty | 1.1 |
| Max new tokens | 96 |
| Stop | `<\|end\|>` or `<\|eos\|>` |

The settings panel can change temperature, top-k, top-p, and max new tokens per message. Evaluation always uses the defaults.

**Context:** reply length is reserved from the 256 tokens. The default of 96 leaves 160 for the conversation. P4-T6 confirms the final generation defaults; older messages get dropped when they don't fit.

**Backend interface:** `apps/api` imports only `src/inference.py`. This is the contract that P4-T8 tests:

```python
engine = InferenceEngine.load(checkpoint_dir, device="cpu")
for text in engine.stream(messages, settings, stop_event):
    ...  # blocking; the API runs it in a worker thread
```

**Artifact:** a folder with weights, tokenizer, model config, default generation settings, and a manifest. It stays out of git, and the API receives its path through `BRAINX_CHECKPOINT`. See [BACKEND.md](BACKEND.md).

**Quantization:** not planned. Only consider it if P4-T6 shows a real speed or memory problem.

## Performance and acceleration policy

The first implementation is deliberately the simplest correct baseline: float32, one device at a time, deterministic settings where possible, and real metrics written to a run folder. An accelerator is adopted only if the same model, data slice, seed, and generation settings show a useful improvement without changing correctness.

| Candidate | When it may be tested | Keep it only when |
|---|---|---|
| MPS | P2-T1 confirms it is available; P3-T6 uses it for the smoke test | It trains correctly and its real memory/speed evidence is recorded |
| `torch.autocast` | P3-T6 after float32 baseline | It improves measured speed or memory without unstable loss; the earlier short random-data check did not show a clear gain |
| `torch.compile` | P3-T6 or P4-T6, after the plain model passes | Compile overhead and steady-state speed are both measured on this Mac; it may be rejected if MPS support is not beneficial |
| Larger batch / gradient accumulation | P3-T6 when memory allows | It improves useful tokens/second without out-of-memory errors or quality regression |
| CPU versus MPS serving | P4-T6 with real exported weights | The chosen device has better measured time-to-first-token, tokens/second, and memory behaviour |
| Quantization | P4-T6 only if deployment memory or speed is a real blocker | Output quality and stopping remain correct and the deployment measurement improves |

Pre-tokenized binary files, a fixed tokenizer, bounded context/output lengths, streaming generation, checkpoint resume, and one loaded inference engine are baseline performance design—not optional polish. The full cross-layer measurement plan is in [QUALITY.md](QUALITY.md#performance-evidence).

## Limits

The model can invent facts confidently, forget long conversations, and repeat problems from its data. It has no safety training. The UI states that its answers can be wrong.

## Tasks

Each task needs approval first. Run commands from the repo root, once P1-T6 has set up `uv`. Packages are listed only when a task first adds them.

### P2-T1: Environment and hardware inspection

- **Objective:** Confirm that the ML environment works on this Mac.
- **Prerequisites:** P1-T6.
- **Files:** `model/pyproject.toml`*, `uv.lock`*.
- **Packages:** `torch`, `jupyterlab`, `ipykernel`, `psutil`.
- **Steps:** Add the packages, then print the Python version, PyTorch version, MPS state, RAM, and free disk.
- **Acceptance:** A small tensor runs on MPS, and a Jupyter kernel starts.
- **Verify:** `uv run --package brainx-model python -c "import torch; print(torch.__version__, torch.backends.mps.is_available())"`
- **Learning:** What MPS is, and why unified memory is shared with the rest of the Mac.

### P2-T2: Model strategy and size decision

- **Objective:** Record the owner's final model size.
- **Prerequisites:** P2-T1.
- **Files:** `docs/MODEL.md`*.
- **Packages:** None.
- **Steps:** Explain scratch against fine-tuning, sizes S, M, L, data needs, and computing limits. Wait for the owner's decision, and record it.
- **Acceptance:** The chosen size is marked as confirmed.
- **Verify:** Owner reads the updated section.
- **Learning:** How parameters, memory, and training time trade off.

### P2-T3: Dataset research

- **Objective:** Confirm licences and pin dataset versions.
- **Prerequisites:** P2-T2.
- **Files:** `docs/MODEL.md`*.
- **Packages:** None.
- **Steps:** Check each dataset page, and record its revision hash and licence. Replace any that fail, with owner approval.
- **Acceptance:** Every dataset has a recorded licence and revision.
- **Verify:** Each record links to its source page.
- **Learning:** Why licences and fixed versions matter.

### P2-T4: Dataset loading

- **Objective:** Load a small, repeatable subset of each dataset.
- **Prerequisites:** P2-T3.
- **Files:** `model/src/data.py`, `model/tests/test_data.py`, `model/pyproject.toml`*, `uv.lock`*.
- **Packages:** `datasets`.
- **Steps:** Load each pinned dataset into `model/data/`, with a subset size setting.
- **Acceptance:** A second run doesn't download again, and subsets have the requested size.
- **Verify:** `uv run --package brainx-model pytest model/tests/test_data.py`
- **Learning:** How datasets are stored, and why we start small.

### P2-T5: Dataset exploration

- **Objective:** Understand the data before changing it.
- **Prerequisites:** P2-T4.
- **Files:** `model/notebooks/01_dataset_exploration.ipynb`, `model/pyproject.toml`*, `uv.lock`*.
- **Packages:** `pandas`, `numpy`, `matplotlib`.
- **Steps:** Inspect schema, examples, missing values, lengths, language share, and duplicates. Chart the results.
- **Acceptance:** The notebook runs top to bottom, and its findings come from real output.
- **Verify:** `uv run --package brainx-model jupyter nbconvert --to notebook --execute model/notebooks/01_dataset_exploration.ipynb --output-dir model/outputs/executed`
- **Learning:** How to find data problems early.

### P2-T6: Data cleaning

- **Objective:** Remove bad text and format conversations.
- **Prerequisites:** P2-T5.
- **Files:** `model/src/data.py`*, `model/tests/test_data.py`*, `model/notebooks/02_data_preprocessing.ipynb`.
- **Packages:** `ftfy`, only if P2-T5 found broken text.
- **Steps:** Normalise text, remove empty and duplicate rows, apply the OASST1 filter, and rebuild conversations.
- **Acceptance:** Tests cover cleaning and a branching OASST1 sample. The notebook reports counts before and after.
- **Verify:** `uv run --package brainx-model pytest model/tests/test_data.py`
- **Learning:** Why data quality limits model quality.

### P2-T7: Dataset splitting

- **Objective:** Create stable splits with no leakage.
- **Prerequisites:** P2-T6.
- **Files:** `model/src/data.py`*, `model/tests/test_data.py`*, `model/notebooks/02_data_preprocessing.ipynb`*.
- **Packages:** None.
- **Steps:** Split by text hash into train, validation, and test, then save the data and a manifest.
- **Acceptance:** Re-running gives the same splits, and no text appears in two splits.
- **Verify:** `uv run --package brainx-model pytest model/tests/test_data.py`
- **Learning:** What data leakage is, and why it makes results look falsely good.

### P2-T8: Tokenizer training

- **Objective:** Write BPE training.
- **Prerequisites:** P2-T7.
- **Files:** `model/src/tokenizer.py`, `model/tests/test_tokenizer.py`, `model/pyproject.toml`*, `uv.lock`*.
- **Packages:** `regex`.
- **Steps:** Implement merge counting and training, plus special tokens, and save as JSON.
- **Acceptance:** The result matches a hand-worked example.
- **Verify:** `uv run --package brainx-model pytest model/tests/test_tokenizer.py`
- **Learning:** How BPE builds a vocabulary.

### P2-T9: Encode, decode, and chat format

- **Objective:** Turn text into tokens and back.
- **Prerequisites:** P2-T8.
- **Files:** `model/src/tokenizer.py`*, `model/tests/test_tokenizer.py`*.
- **Packages:** None.
- **Steps:** Add encode, decode, streaming decode, and `format_chat()`.
- **Acceptance:** Unicode, emoji, and special tokens round-trip, and split characters are held back until complete.
- **Verify:** `uv run --package brainx-model pytest model/tests/test_tokenizer.py`
- **Learning:** Why one token can end partway through a character.

### P2-T10: Prepare token files

- **Objective:** Train the real tokenizer, and encode the data.
- **Prerequisites:** P2-T9.
- **Files:** `model/src/data.py`*, `model/notebooks/03_tokenizer.ipynb`.
- **Packages:** None.
- **Steps:** Train on a sample, report the time taken, analyse token lengths, and write memory-mapped files.
- **Acceptance:** Vocabulary has 8,000 tokens, and decoding a slice returns the source text.
- **Verify:** `uv run --package brainx-model jupyter nbconvert --to notebook --execute model/notebooks/03_tokenizer.ipynb --output-dir model/outputs/executed`
- **Learning:** Why token files make training faster.

### P3-T1: Model architecture selection

- **Objective:** Confirm the architecture, and estimate its memory use.
- **Prerequisites:** P2-T10.
- **Files:** `docs/MODEL.md`*, `model/notebooks/04_model_architecture.ipynb`.
- **Packages:** None.
- **Steps:** Explain embeddings, attention, feed-forward layers, and normalisation. Calculate parameters for the chosen size.
- **Acceptance:** The owner approves the final values.
- **Verify:** `uv run --package brainx-model jupyter nbconvert --to notebook --execute model/notebooks/04_model_architecture.ipynb --output-dir model/outputs/executed`
- **Learning:** What each part of a Transformer does.

### P3-T2: Model implementation

- **Objective:** Write the Transformer.
- **Prerequisites:** P3-T1.
- **Files:** `model/src/model.py`, `model/tests/test_model.py`, `model/notebooks/04_model_architecture.ipynb`*.
- **Packages:** None.
- **Steps:** Write attention, the block, the model, and a KV cache.
- **Acceptance:** Selected size S has its calculated parameter count. Changing a later token can't affect earlier outputs. Cached and uncached logits match.
- **Verify:** `uv run --package brainx-model pytest model/tests/test_model.py`
- **Learning:** How causal attention stops the model seeing the future.

### P3-T3: Training configuration

- **Objective:** Keep every training choice in one file.
- **Prerequisites:** P3-T2.
- **Files:** `model/configs/training.yaml`, `model/src/train.py`, `model/tests/test_train.py`, `model/pyproject.toml`*, `uv.lock`*.
- **Packages:** `pyyaml`.
- **Steps:** Define sizes, batch, learning rate, seed, and paths, with validation.
- **Acceptance:** A valid file loads, and an invalid one gives a clear error.
- **Verify:** `uv run --package brainx-model pytest model/tests/test_train.py`
- **Learning:** Why config files help reproducibility.

### P3-T4: Training loop

- **Objective:** Write pre-training, with logs.
- **Prerequisites:** P3-T3.
- **Files:** `model/src/train.py`*, `model/tests/test_train.py`*, `model/pyproject.toml`*, `uv.lock`*.
- **Packages:** `tqdm`.
- **Steps:** Add device detection, seeds, batches, AdamW, the scheduler, accumulation, clipping, validation, and `metrics.jsonl`.
- **Acceptance:** Starting loss is near 8.99, and one small batch overfits.
- **Verify:** `uv run --package brainx-model pytest model/tests/test_train.py`
- **Learning:** What happens in each training step.

### P3-T5: Checkpoints and failure recovery

- **Objective:** Make long runs safe to interrupt.
- **Prerequisites:** P3-T4.
- **Files:** `model/src/train.py`*, `model/tests/test_train.py`*.
- **Packages:** None.
- **Steps:** Add atomic saving, resume, the run record, and the NaN and out-of-memory stops.
- **Acceptance:** Resume continues from the saved step, and a forced NaN stops with a clear message.
- **Verify:** `uv run --package brainx-model pytest model/tests/test_train.py`
- **Learning:** Why training saves optimiser state as well as weights.

### P3-T6: Training smoke test

- **Objective:** Prove the pipeline on real data, and measure speed.
- **Prerequisites:** P3-T5.
- **Files:** `model/notebooks/05_model_training.ipynb`, `docs/PROGRESS.md`*.
- **Packages:** None.
- **Steps:** With approval, run about 10 minutes on size S with a subset. Interrupt and resume once. Chart the loss, then estimate the full run.
- **Acceptance:** Loss falls, resume works, and real speed is recorded.
- **Verify:** Read the run folder's `metrics.jsonl`.
- **Learning:** How to read a loss curve.

### P3-T7: Fine-tuning mode

- **Objective:** Add instruction fine-tuning to our own model.
- **Prerequisites:** P3-T6.
- **Files:** `model/src/train.py`*, `model/tests/test_train.py`*, `model/configs/training.yaml`*.
- **Packages:** None.
- **Steps:** Load our checkpoint, batch conversations, and count only assistant tokens in the loss.
- **Acceptance:** Tests confirm which tokens count, and the mode refuses to run without a checkpoint.
- **Verify:** `uv run --package brainx-model pytest model/tests/test_train.py`
- **Learning:** How fine-tuning differs from pre-training.

### P3-T8: Fixed test prompts

- **Objective:** Write the test questions before seeing full results.
- **Prerequisites:** P3-T7.
- **Files:** `model/configs/eval_prompts.jsonl`.
- **Packages:** None.
- **Steps:** Write about 30 prompts, not taken from training data.
- **Acceptance:** All three categories are covered.
- **Verify:** Owner reviews them.
- **Learning:** Why tests are written before results exist.

### P3-T9: Full pre-training run

- **Objective:** Train the real model.
- **Prerequisites:** P3-T8, and explicit owner approval.
- **Files:** `docs/PROGRESS.md`*.
- **Packages:** None.
- **Steps:** Agree the duration, run `src/train.py` in a terminal with `caffeinate -i`, and report from the run folder.
- **Acceptance:** A checkpoint and full run record exist.
- **Verify:** Read `metrics.jsonl`.
- **Learning:** What overfitting and underfitting look like.

### P3-T10: Fine-tuning run

- **Objective:** Teach the pre-trained model to reply.
- **Prerequisites:** P3-T9, and explicit owner approval.
- **Files:** `docs/PROGRESS.md`*.
- **Packages:** None.
- **Steps:** Run fine-tuning, and stop when validation loss stops improving.
- **Acceptance:** A checkpoint and full run record exist.
- **Verify:** Read `metrics.jsonl`.
- **Learning:** Why a smaller learning rate is used here.

### P3-T11: Checkpoint validation

- **Objective:** Confirm that the saved model is usable.
- **Prerequisites:** P3-T10.
- **Files:** `model/tests/test_train.py`*.
- **Packages:** None.
- **Steps:** Reload with `weights_only=True`, and check its tokenizer and config match.
- **Acceptance:** Reloaded weights give the same output on CPU, and a mismatched tokenizer is refused.
- **Verify:** `uv run --package brainx-model pytest model/tests/test_train.py`
- **Learning:** Why model and tokenizer must stay together.

### P4-T1: Text generation

- **Objective:** Generate text from a prompt.
- **Prerequisites:** P3-T11.
- **Files:** `model/src/inference.py`, `model/tests/test_inference.py`.
- **Packages:** None.
- **Steps:** Add `InferenceEngine`, sampling, and stop tokens.
- **Acceptance:** A fixed seed repeats on CPU, and stop tokens end generation.
- **Verify:** `uv run --package brainx-model pytest model/tests/test_inference.py`
- **Learning:** How temperature and top-p change output.

### P4-T2: Context handling

- **Objective:** Fit conversations into the context limit.
- **Prerequisites:** P4-T1.
- **Files:** `model/src/inference.py`*, `model/tests/test_inference.py`*.
- **Packages:** None.
- **Steps:** Reserve reply length, keep the newest whole messages, and handle one very long message.
- **Acceptance:** Tests cover short and over-limit conversations.
- **Verify:** `uv run --package brainx-model pytest model/tests/test_inference.py`
- **Learning:** Why a model "forgets".

### P4-T3: Streaming and cancellation

- **Objective:** Yield text piece by piece, and stop on request.
- **Prerequisites:** P4-T2.
- **Files:** `model/src/inference.py`*, `model/tests/test_inference.py`*.
- **Packages:** None.
- **Steps:** Add `stream()` with streaming decode and `stop_event`.
- **Acceptance:** Emoji decode correctly, and setting `stop_event` ends generation within one token.
- **Verify:** `uv run --package brainx-model pytest model/tests/test_inference.py`
- **Learning:** How Python generators support streaming.

### P4-T4: Evaluation

- **Objective:** Measure the model honestly.
- **Prerequisites:** P4-T3.
- **Files:** `model/src/evaluate.py`, `model/tests/test_evaluate.py`, `model/notebooks/06_model_evaluation.ipynb`, `docs/MODEL.md`*.
- **Packages:** None.
- **Steps:** Calculate held-out loss and perplexity, run the fixed prompts, and record repetition, wrong answers, speed, and memory.
- **Acceptance:** Raw outputs are saved, and measured results stay separate from opinions.
- **Verify:** `uv run --package brainx-model pytest model/tests/test_evaluate.py`
- **Learning:** What perplexity means, and what it can't tell you.

### P4-T5: Baseline comparison

- **Objective:** Prove that the model beats something simple.
- **Prerequisites:** P4-T4.
- **Files:** `model/src/evaluate.py`*, `model/tests/test_evaluate.py`*, `model/notebooks/06_model_evaluation.ipynb`*, `docs/MODEL.md`*.
- **Packages:** None.
- **Steps:** Write the bigram baseline in `evaluate.py` (count how often each token follows another in the training tokens, with add-one smoothing) and test it on a tiny corpus against hand-calculated values. Then compare the baseline, pre-trained model, and fine-tuned model, select a checkpoint, and set thresholds.
- **Acceptance:** The table uses real runs. If a stage doesn't help, report that plainly.
- **Verify:** Owner reviews the table and raw outputs.
- **Learning:** Why a baseline gives a score meaning.

### P4-T6: Inference testing

- **Objective:** Test real behaviour and speed.
- **Prerequisites:** P4-T5.
- **Files:** `model/notebooks/07_inference_testing.ipynb`, `docs/MODEL.md`*.
- **Packages:** None.
- **Steps:** Test settings, stopping, and multi-turn chat in English. Compare CPU and MPS speed and memory on real weights. Freeze defaults.
- **Acceptance:** Real numbers are recorded, and the device choice is confirmed or updated.
- **Verify:** `uv run --package brainx-model jupyter nbconvert --to notebook --execute model/notebooks/07_inference_testing.ipynb --output-dir model/outputs/executed`
- **Learning:** Why a GPU isn't always faster for one stream.

### P4-T7: Model artifact export

- **Objective:** Package everything the backend needs.
- **Prerequisites:** P4-T6.
- **Files:** `model/src/inference.py`*, `model/tests/test_inference.py`*.
- **Packages:** `safetensors`, only if approved here.
- **Steps:** Export weights, tokenizer, config, default settings, and a manifest into `model/checkpoints/export/`, which `BRAINX_CHECKPOINT` points to.
- **Acceptance:** A fresh process loads the artifact and generates text with the network off.
- **Verify:** `uv run --package brainx-model pytest model/tests/test_inference.py`
- **Learning:** What makes a model portable.

### P4-T8: FastAPI integration readiness

- **Objective:** Pass the model milestone.
- **Prerequisites:** P4-T7.
- **Files:** `model/tests/test_inference.py`*, `docs/PROGRESS.md`*.
- **Packages:** None.
- **Steps:** Test the documented interface using a small test checkpoint, then chat with the real model.
- **Acceptance:** The owner confirms that the local model generates text with no external API. Phase 5 starts only after this.
- **Verify:** `uv run --package brainx-model pytest model/tests/test_inference.py`
- **Learning:** Why a small, clear interface keeps ML and backend code separate.
