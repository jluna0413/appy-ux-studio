# Coding Models Research — Fast, Reliable, Single-Purpose

**Date:** 2026-11-16
**Hardware:** EVO-X2 (AMD APU, 64GB RAM, no dedicated GPU) + current Intel Arc B70 (XPU)
**Preference:** Fast, reliable, single-purpose models over huge monolithic "can do it all" models
**Use cases:** Code generation, code review, bug fixing, refactoring, documentation

---

## 1. Model Selection Criteria

| Criterion | Weight | Why |
|-----------|--------|-----|
| **Speed** | High | Agent loops are throughput-bound; slow models kill productivity |
| **Code quality** | High | Must produce working, correct code |
| **Tool calling** | High | OpenCode/Codex need function calling for file edits |
| **Size (VRAM/RAM)** | Medium | EVO-X2 has 64GB shared RAM, no dedicated GPU |
| **License** | Medium | Apache 2.0 or MIT preferred for commercial use |
| **FIM support** | Low | Nice-to-have for autocomplete, not critical for agents |

---

## 2. Top Recommendations (Updated Nov 26, 2026)

### Tier 1: Best Overall (64GB RAM, EVO-X2)

#### Qwen3-Coder-Next (80B total, 3B active) — STILL BEST FOR AGENTIC CODING
- **Size:** 46GB at Q4
- **Context:** 262K tokens
- **License:** Apache 2.0
- **Speed:** 20+ tok/s on 64GB
- **Strengths:** Purpose-built for agentic coding, tool calling, repository-scale work
- **New:** No new checkpoint in Nov 2026 window — still the top pick
- **Ollama:** `ollama pull qwen3-coder-next`
- **Verdict:** **Primary coding model for EVO-X2.** Best quality for agentic work on 64GB.

#### ripple-preview:65b (65B dense) — NEW Nov 2026
- **Size:** 39-46GB at Q4
- **Context:** 2M tokens (tag), 1M (model card)
- **License:** (check model card)
- **Speed:** TBD
- **Strengths:** 65B dense, purpose-built for agentic coding, 2M context window
- **Weaknesses:** Very new, unproven, large download
- **Ollama:** `ollama pull ripple-preview:65b`
- **Verdict:** **Worth testing.** Massive context window. Could be better than Qwen3-Coder-Next for large repos.

#### Kolibri 1 (78B total, 3.5B active) — NEW Oct 2026
- **Size:** 43GB at Q4
- **Context:** 262K native, 1M validated
- **License:** Apache 2.0
- **Speed:** Fast (MoE, only 3.5B active)
- **Strengths:** MoE efficiency, Apache 2.0, 1M context validated
- **Weaknesses:** New, less tested
- **Verdict:** **Alternative to Qwen3-Coder-Next.** MoE makes it faster despite 78B size.

### Tier 2: Best for 16-32GB (Current Machine or EVO-X2)

#### Qwen3.8-27B (27B dense) — STILL BEST SINGLE-GPU CODING
- **Size:** 15-18GB at Q4
- **Context:** 262K tokens
- **License:** Apache 2.0
- **Speed:** 20+ tok/s on 32GB
- **BenchLM coding score:** 45.84 (highest for single 24GB GPU)
- **Strengths:** Best quality per GB, vision, tool calling, thinking mode
- **New:** Arete-27B (Nov 2026) is a values fine-tune — not needed for coding
- **Ollama:** `ollama run qwen3.8:27b`
- **Verdict:** **Best for 24GB GPU.** Still the top pick for single-GPU coding.

#### flint:40b (39.8B MoE) — NEW Nov 2026
- **Size:** 23GB at Q4
- **Context:** 256K tokens
- **License:** (check model card)
- **Speed:** Fast (MoE)
- **Strengths:** 39.8B MoE from Recursive, purpose-built for coding agents
- **Weaknesses:** Very new, 23GB needs 24GB+ VRAM
- **Ollama:** `ollama pull flint:40b`
- **Verdict:** **Worth testing.** Could be a faster alternative to Qwen3.8-27B.

#### Mellum2.1 Thinking (12B total, 2.5B active) — NEW Oct 2026
- **Size:** 6.7-8.1GB at Q4
- **Context:** 131K tokens
- **License:** Apache 2.0
- **Speed:** Fast (MoE, only 2.5B active)
- **Strengths:** JetBrains-built, Apache 2.0, thinking mode, small download
- **Weaknesses:** 131K context (smaller than Qwen3.8-27B's 262K)
- **Verdict:** **Great for 16GB machines.** JetBrains quality, small footprint.

#### LFM2.5-24B-A2B (24B total, 2.45B active) — NEW Oct 2026
- **Size:** 13GB at Q4
- **Context:** 131K tokens
- **License:** LFM Open License 1.0 (revenue cap)
- **Speed:** Fast (MoE, only 2.45B active)
- **Strengths:** Very fast (only 2.45B active), 13GB download
- **Weaknesses:** Revenue-capped license, 131K context
- **Verdict:** **Fastest option for 16GB.** But license has revenue cap.

#### Bonsai 2 27B (27B dense, ternary) — NEW Sep 2026
- **Size:** 5.95-7.21GB at Q4 (ternary weights!)
- **Context:** 262K tokens
- **License:** Apache 2.0
- **Speed:** Very fast (ternary = tiny)
- **Strengths:** 27B quality in 6GB! Apache 2.0, 262K context
- **Weaknesses:** Ternary quantization may reduce quality
- **Verdict:** **Incredible size/quality ratio.** 27B in 6GB. Worth testing.

### Tier 3: Best for 8GB or less (Quick Tasks)

#### mimo-v2.6:9b (9B dense) — NEW Nov 2026
- **Size:** 6.6-8.7GB at Q4
- **Context:** 256K tokens
- **License:** (check model card)
- **Speed:** Moderate
- **Strengths:** Xiaomi distill of Qwen 9B, text + image, 256K context
- **Weaknesses:** New, unproven
- **Ollama:** `ollama pull mimo-v2.6:9b`
- **Verdict:** **Worth testing as Qwen3.5 9B alternative.**

#### lfm3:1.7b (1.7B tri-hybrid) — NEW Nov 2026
- **Size:** 1.1-1.7GB
- **Context:** 256K tokens
- **License:** (check model card)
- **Speed:** Very fast
- **Strengths:** Tri-hybrid model for local agents, tiny
- **Weaknesses:** Very small, limited capability
- **Ollama:** `ollama pull lfm3:1.7b`
- **Verdict:** **Ultra-lightweight agent.** Good for simple tool-calling tasks.

#### Phi-4-mini (3.8B) — Still best for constrained
- **Size:** 2.5GB at Q4
- **Context:** 128K tokens
- **License:** MIT
- **Speed:** Very fast
- **Verdict:** **Best for documentation and simple tasks.** MIT license.

#### Qwen2.5-Coder 7B — Still best for FIM
- **Size:** 4.7-5.4GB at Q4/Q5
- **Context:** 128K tokens
- **License:** Apache 2.0
- **Speed:** 44-52 tok/s
- **HumanEval:** 84.8%
- **Verdict:** **Still the FIM king.** No model has displaced it at 7B for autocomplete.

### User Feedback (Nov 26, 2026)

Based on the user's personal experience with these model families:

#### ❌ REMOVE from recommendations:
- **lfm3:1.7b** — "would have to be tested and validated before even considering. personal experience with this family of models would hallucinate more than it would ever give usable output"
- **LFM2.5 series** — Same issue, hallucinates too much, not usable
- **ripple-preview:65b** — "massive" (too big for EVO-X2)
- **flint:40b** — "massive" (too big for EVO-X2)
- **Kolibri 1** — "massive" (too big for EVO-X2)

#### ✅ KEEP as daily drivers:
- **Bonsai 2 27B / ternary bonsai 27B** — User's usual daily drivers
- **unsloth/qwen3.8 27b v3.1** — User uses this, feels too heavy but works

#### 🔬 BENCHMARK (user has experience, needs validation):
- **mimo-v2.6:9b** — User has used it before, "might be a good fit for either [job], we should benchmark"
- **Mellum2.1 Thinking** — User not familiar, "we should benchmark"
- **Qwen2.5-Coder 7B** — "we can bench for both jobs"
- **Phi-4** — "we can bench for both jobs"

#### 📊 User's Model Experience Summary:
| Model | User Experience | Verdict |
|-------|----------------|---------|
| Bonsai 2 27B (ternary) | Daily driver | ✅ Keep |
| unsloth/qwen3.8 27b v3.1 | Used, feels heavy but works | ✅ Keep |
| mimo-v2.6:9b | Used before | 🔬 Benchmark |
| Mellum2.1 Thinking | Not familiar | 🔬 Benchmark |
| Qwen2.5-Coder 7B | Not yet tested | 🔬 Benchmark |
| Phi-4 | Not yet tested | 🔬 Benchmark |
| lfm3:1.7b | Hallucinates too much | ❌ Remove |
| LFM2.5 series | Hallucinates too much | ❌ Remove |
| ripple/flint/kolibri | Too massive | ❌ Remove |

---

## 3. Local Models Already Available

### LM Studio (http://localhost:1234)
| Model | Size | Best For |
|-------|------|----------|
| qwen3.8-0.8b@q8_0 | 0.8B | Token budget sentinel (already used) |
| qwen3.5-4b | 4B | Light coding, documentation |
| qwen3.5-9b | 9B | Chat coding, single-file edits |
| qwen3.5-4b-3d-coder | 4B | 3D code generation |
| qwen3.5-4b-qat | 4B | Quantization-aware training |
| gemma4:e4b (Ollama) | 4B | General coding, multimodal |
| gemma4:12b (Ollama) | 12B | Better quality coding |

### Ollama
| Model | Size | Best For |
|-------|------|----------|
| qwen3.5:4b | 4B | Light agent tasks |
| qwen3.5:9b | 9B | Chat coding, single-file edits |
| gemma4:e4b | 4B | General coding |
| gemma4:12b | 12B | Better quality coding |
| cc/qwen3.5-4b-3d-coder | 4B | 3D code generation |

---

## 4. Recommended Model Stack

### For EVO-X2 (64GB RAM, AMD APU, no GPU)

| Role | Model | Size | Why |
|------|-------|------|-----|
| **Primary coding** | Qwen3-Coder-Next | 46GB (Q4) | Best agentic coding, 3B active, 262K context |
| **Secondary coding** | Qwen3.8-27B | 18GB (Q4) | Best quality per GB, vision, tool calling |
| **Autocomplete/FIM** | Qwen2.5-Coder 7B | 5GB (Q5) | FIM king, 84.8% HumanEval, fast |
| **Code review** | Qwen3.8-27B | 18GB (Q4) | Same as secondary, good at analysis |
| **Documentation** | Phi-4-mini | 2.5GB (Q4) | Tiny, fast, 128K context, MIT |
| **Quick tasks** | Qwen3.5 4B | 3.4GB (Q4) | Already available, fast |
| **Fallback** | DeepSeek-Coder 6.7B | 4.9GB (Q5) | Fast, MIT license, single-function |

### For Current Machine (Intel Arc B70, XPU)

| Role | Model | Size | Why |
|------|-------|------|-----|
| **Primary coding** | Qwen3-Coder-30B-A3B | 19GB (Q4) | MoE, fast, SWE-bench 50.3% |
| **Secondary coding** | Qwen3.8-27B | 18GB (Q4) | Best quality per GB |
| **Autocomplete/FIM** | Qwen2.5-Coder 7B | 5GB (Q5) | FIM king, fast |
| **Code review** | Qwen3.8-27B | 18GB (Q4) | Good at analysis |
| **Documentation** | Phi-4-mini | 2.5GB (Q4) | Tiny, fast |
| **Quick tasks** | Qwen3.5 4B | 3.4GB (Q4) | Already available |
| **Fallback** | DeepSeek-Coder 6.7B | 4.9GB (Q5) | Fast, MIT license |

---

## 5. Single-Purpose vs Monolithic

### Why Single-Purpose Models Win

| Approach | Pros | Cons |
|----------|------|------|
| **Single-purpose (recommended)** | Fast, reliable, small, easy to swap, lower cost | Need to manage multiple models |
| **Monolithic (avoid)** | One model for everything | Slow, expensive, hard to debug, single point of failure |

### Recommended Strategy

```
For each task type, use the smallest model that can do it well:

Documentation → Phi-4-mini (2.5GB, instant)
Quick fix → Qwen3.5 4B (3.4GB, fast)
Code generation → Qwen2.5-Coder 7B (5GB, fast) or Qwen3-Coder-Next (46GB, best)
Code review → Qwen3.8-27B (18GB, thorough)
Complex refactor → Qwen3-Coder-Next (46GB, best quality)
```

**Rule:** Start small, escalate only if needed. Don't use a 46GB model for a documentation task.

---

## 6. Integration with OpenCode & Codex

### OpenCode Configuration

OpenCode supports multiple providers. Configure it to use local models:

```json
// ~/.config/opencode/config.json
{
  "provider": "ollama",
  "model": "qwen3-coder-next",
  "base_url": "http://localhost:11434"
}
```

Or use LM Studio:

```json
{
  "provider": "openai-compatible",
  "model": "qwen3.8-27b",
  "base_url": "http://localhost:1234/v1",
  "api_key": "not-needed"
}
```

### Codex Configuration

Codex CLI supports custom providers:

```bash
# Use OpenAI API (paid)
codex --model gpt-4o

# Use local model via Ollama
OPENAI_API_KEY=ollama OPENAI_BASE_URL=http://localhost:11434/v1 codex --model qwen3-coder-next
```

### Model Routing Strategy

```
Task arrives → Orchestrator classifies:
  - Simple (docs, quick fix) → Phi-4-mini or Qwen3.5 4B (fast, cheap)
  - Medium (feature, single-file) → Qwen2.5-Coder 7B or Qwen3.5 9B
  - Complex (refactor, multi-file) → Qwen3-Coder-Next or Qwen3.8-27B
  - Review (code review, security) → Qwen3.8-27B (thorough analysis)
  - Fallback (if primary fails) → DeepSeek-Coder 6.7B or Codex (OpenAI API)
```

---

## 7. Cost Comparison

| Approach | Monthly Cost | Speed | Quality |
|----------|-------------|-------|---------|
| **All local (recommended)** | $0 (after download) | Fast (local) | Good to excellent |
| **OpenCode Go + local** | $10/mo | Fast | Good to excellent |
| **OpenAI API (Codex)** | $5-20/mo | Fast (cloud) | Excellent |
| **Claude API (OpenCode)** | $20-50/mo | Fast (cloud) | Excellent |
| **All cloud** | $50-100/mo | Fast | Excellent |

**Recommendation:** Start with all local models. Add OpenCode Go ($10/mo) for better tool calling. Use OpenAI API only as fallback for complex tasks that local models can't handle.

---

## 8. Download Priority

### Phase 1: Immediate (Already Available)
- [x] qwen3.5:4b (Ollama) — quick tasks
- [x] qwen3.5:9b (Ollama) — chat coding
- [x] gemma4:e4b (Ollama) — general coding
- [x] gemma4:12b (Ollama) — better quality
- [x] qwen3.8-0.8b@q8_0 (LM Studio) — sentinel

### Phase 2: High Priority (Download Now)
- [ ] Qwen2.5-Coder 7B (Ollama) — `ollama pull qwen2.5-coder:7b` (5GB)
- [ ] Phi-4-mini (Ollama) — `ollama pull phi4-mini` (2.5GB)
- [ ] DeepSeek-Coder 6.7B (Ollama) — `ollama pull deepseek-coder:6.7b` (4.9GB)

### Phase 3: Medium Priority (Download When EVO-X2 Arrives)
- [ ] Qwen3-Coder-Next (Ollama or LM Studio) — 46GB, needs 64GB
- [ ] Qwen3.8-27B (LM Studio) — 18GB, needs 32GB+
- [ ] Qwen3-Coder-30B-A3B (Ollama) — 19GB, needs 24GB+

### Phase 4: Optional (Nice-to-Have)
- [ ] Devstral Small 24B (Ollama) — `ollama pull devstral` (14GB)
- [ ] Qwen3.5 4B 3D Coder (already in Ollama) — for 3D code generation

---

## 9. Open Questions

1. **AMD APU performance:** How fast will Qwen3-Coder-Next run on EVO-X2's integrated GPU? Need to benchmark.
2. **Ollama on Windows AMD:** Ollama's AMD support on Windows is limited (WSL2 or CPU). May need to use LM Studio or llama.cpp directly.
3. **Model switching:** How quickly can OpenCode switch between models? Need to test.
4. **Context window:** 262K context is great, but does the EVO-X2 have enough RAM to actually use it?
5. **Tool calling reliability:** Do smaller models (7B, 4B) reliably call tools in OpenCode? Need to test.
