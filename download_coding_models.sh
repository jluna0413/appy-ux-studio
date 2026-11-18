#!/bin/bash
# download_coding_models.sh — Download recommended coding models (Updated Nov 26, 2026)
# Run on EVO-X2 or current machine with Ollama installed

echo "=== Phase 1: Already Available (no download needed) ==="
echo "  qwen3.5:4b, qwen3.5:9b, gemma4:e4b, gemma4:12b, qwen3.8-0.8b@q8_0"

echo ""
echo "=== Phase 2: High Priority (Download Now) ==="
echo "Downloading Qwen2.5-Coder 7B (FIM king, 84.8% HumanEval)..."
ollama pull qwen2.5-coder:7b

echo "Downloading Phi-4-mini (tiny, fast, 128K context, MIT)..."
ollama pull phi4-mini

echo "Downloading DeepSeek-Coder 6.7B (fast fallback, MIT license)..."
ollama pull deepseek-coder:6.7b

echo ""
echo "=== Phase 3: New Models to Test (User Feedback) ==="
echo "Downloading Bonsai 2 27B (ternary, user's daily driver)..."
echo "  Note: Download from HuggingFace, not Ollama"
echo "  URL: https://huggingface.co/prism-ml/bonsai-2-27b"

echo "Downloading mimo-v2.6:9b (Xiaomi distill, user has experience)..."
ollama pull mimo-v2.6:9b 2>/dev/null || echo "Not yet available on Ollama, check HuggingFace"

echo "Downloading Mellum2.1 Thinking (JetBrains, user unfamiliar)..."
ollama pull mellum2.1-thinking 2>/dev/null || echo "Not yet available on Ollama, check HuggingFace"

echo ""
echo "=== REMOVED (user feedback) ==="
echo "  lfm3:1.7b — hallucinates too much"
echo "  LFM2.5 series — hallucinates too much"
echo "  ripple/flint/kolibri — too massive for EVO-X2"

echo ""
echo "=== Phase 4: EVO-X2 Only (needs 32GB+) ==="
echo "Skipping Qwen3-Coder-Next (46GB) — download manually: ollama pull qwen3-coder-next"
echo "Skipping Qwen3.8-27B (18GB) — download manually: ollama run qwen3.8:27b"
echo "Skipping flint:40b (23GB) — download manually: ollama pull flint:40b"
echo "Skipping ripple-preview:65b (46GB) — download manually: ollama pull ripple-preview:65b"
echo "Skipping Kolibri 1 (43GB) — download manually from HuggingFace"

echo ""
echo "=== Done! Installed models: ==="
ollama list