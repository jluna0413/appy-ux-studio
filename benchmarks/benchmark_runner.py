#!/usr/bin/env python3
"""
Model Benchmark Runner — Appy-UX Studio
Benchmarks coding models on standardized tasks.
Supports LM Studio (OpenAI-compatible) and Ollama APIs.

Usage:
    python benchmark_runner.py --models mimo-v2.6:9b phi4-mini --categories code_generation code_review
    python benchmark_runner.py --all  # Run all models and categories
"""

import argparse
import json
import time
import os
import sys
import requests
from pathlib import Path

BENCHMARK_DIR = Path(__file__).parent
TEST_CASES_DIR = BENCHMARK_DIR / "test_cases"
RESULTS_DIR = BENCHMARK_DIR / "results"
RESULTS_DIR.mkdir(exist_ok=True)

# Model endpoints
LM_STUDIO_URL = "http://localhost:1234/v1/chat/completions"
OLLAMA_URL = "http://localhost:11434/api/chat"

# Models to benchmark (name -> endpoint config)
MODELS = {
    "mimo-v2.6:9b": {"type": "lmstudio", "model": "mimo-v2.6-distill-qwen-9b-mtp"},
    "bonsai-2-9b": {"type": "lmstudio", "model": "ternary-bonsai-2-9b-decisive"},
    "bonsai-2-27b": {"type": "lmstudio", "model": "prism-ml-ternary-bonsai-2-27b"},
    "qwen3.8-27b": {"type": "lmstudio", "model": "qwen3.8-27b-gsq-rco"},
    "qwen2.5-coder:7b": {"type": "ollama", "model": "qwen2.5-coder:7b"},
    "phi4-mini": {"type": "ollama", "model": "phi4-mini"},
    "deepseek-coder:6.7b": {"type": "ollama", "model": "deepseek-coder:6.7b"},
    "qwen3.5:4b": {"type": "ollama", "model": "qwen3.5:4b"},
    "qwen3.5:9b": {"type": "ollama", "model": "qwen3.5:9b"},
}


def load_test_cases(category=None):
    """Load test cases from JSON files."""
    cases = []
    for f in TEST_CASES_DIR.glob("*.json"):
        with open(f) as fh:
            case = json.load(fh)
            if category is None or case["category"] == category:
                cases.append(case)
    return cases


def call_model(model_config, prompt, system_prompt=None):
    """Call a model and return response + timing."""
    start = time.time()
    
    if model_config["type"] == "lmstudio":
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        resp = requests.post(LM_STUDIO_URL, json={
            "model": model_config["model"],
            "messages": messages,
            "temperature": 0.1,
            "max_tokens": 2048,
        }, timeout=300)
        data = resp.json()
        content = data["choices"][0]["message"]["content"]
        # Some models use reasoning_content instead of content
        if not content:
            content = data["choices"][0]["message"].get("reasoning_content", "")
        tokens = data.get("usage", {}).get("completion_tokens", len(content.split()))
        
    elif model_config["type"] == "ollama":
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        resp = requests.post(OLLAMA_URL, json={
            "model": model_config["model"],
            "messages": messages,
            "stream": False,
            "options": {"temperature": 0.1, "num_predict": 2048},
        }, timeout=300)
        data = resp.json()
        content = data["message"]["content"]
        tokens = data.get("eval_count", len(content.split()))
    
    elapsed = time.time() - start
    tok_per_sec = tokens / elapsed if elapsed > 0 else 0
    
    return {
        "content": content,
        "tokens": tokens,
        "elapsed": round(elapsed, 2),
        "tok_per_sec": round(tok_per_sec, 1),
    }


def score_output(output, test_case):
    """Score model output against test case expectations."""
    content = output["content"].lower()
    expected = test_case.get("expected", {})
    
    # Automated checks
    must_contain = expected.get("must_contain", [])
    must_not_contain = expected.get("must_not_contain", [])
    
    contain_score = sum(1 for kw in must_contain if kw.lower() in content) / max(len(must_contain), 1)
    not_contain_score = 1.0 - (sum(1 for kw in must_not_contain if kw.lower() in content) / max(len(must_not_contain), 1))
    
    automated_score = (contain_score + not_contain_score) / 2 * 100
    
    return {
        "automated_score": round(automated_score, 1),
        "contain_matches": sum(1 for kw in must_contain if kw.lower() in content),
        "contain_total": len(must_contain),
        "not_contain_violations": sum(1 for kw in must_not_contain if kw.lower() in content),
        "not_contain_total": len(must_not_contain),
    }


def run_benchmark(model_name, model_config, test_cases):
    """Run benchmark for a single model on given test cases."""
    results = []
    
    for tc in test_cases:
        print(f"  Running {tc['id']} ({tc['name']})...")
        
        try:
            output = call_model(model_config, tc["prompt"])
            scores = score_output(output, tc)
            
            result = {
                "test_id": tc["id"],
                "test_name": tc["name"],
                "category": tc["category"],
                "difficulty": tc["difficulty"],
                "model": model_name,
                "output": output["content"][:500],  # Truncate for storage
                "tokens": output["tokens"],
                "elapsed": output["elapsed"],
                "tok_per_sec": output["tok_per_sec"],
                "automated_score": scores["automated_score"],
                "contain_matches": scores["contain_matches"],
                "contain_total": scores["contain_total"],
                "not_contain_violations": scores["not_contain_violations"],
                "status": "success",
            }
        except Exception as e:
            result = {
                "test_id": tc["id"],
                "test_name": tc["name"],
                "category": tc["category"],
                "difficulty": tc["difficulty"],
                "model": model_name,
                "error": str(e),
                "status": "error",
            }
        
        results.append(result)
        print(f"    Score: {result.get('automated_score', 'N/A')} | Speed: {result.get('tok_per_sec', 'N/A')} tok/s | Time: {result.get('elapsed', 'N/A')}s")
    
    return results


def generate_report(all_results):
    """Generate a summary report from all results."""
    report = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "models": {},
    }
    
    # Group by model
    models = set(r["model"] for r in all_results)
    for model in models:
        model_results = [r for r in all_results if r["model"] == model and r["status"] == "success"]
        if not model_results:
            continue
        
        categories = set(r["category"] for r in model_results)
        cat_scores = {}
        for cat in categories:
            cat_results = [r for r in model_results if r["category"] == cat]
            cat_scores[cat] = round(sum(r["automated_score"] for r in cat_results) / len(cat_results), 1)
        
        overall = round(sum(r["automated_score"] for r in model_results) / len(model_results), 1)
        avg_speed = round(sum(r["tok_per_sec"] for r in model_results) / len(model_results), 1)
        total_time = round(sum(r["elapsed"] for r in model_results), 1)
        
        report["models"][model] = {
            "overall_score": overall,
            "category_scores": cat_scores,
            "avg_tok_per_sec": avg_speed,
            "total_time": total_time,
            "tests_passed": len(model_results),
            "tests_failed": len([r for r in all_results if r["model"] == model and r["status"] == "error"]),
        }
    
    return report


def main():
    parser = argparse.ArgumentParser(description="Model Benchmark Runner")
    parser.add_argument("--models", nargs="+", help="Models to benchmark")
    parser.add_argument("--categories", nargs="+", help="Categories to run")
    parser.add_argument("--all", action="store_true", help="Run all models and categories")
    args = parser.parse_args()
    
    # Determine models to run
    if args.all:
        models_to_run = list(MODELS.keys())
    elif args.models:
        models_to_run = args.models
    else:
        models_to_run = ["mimo-v2.6:9b"]  # Default
    
    # Determine categories
    if args.categories:
        categories = args.categories
    else:
        categories = None  # All categories
    
    # Load test cases
    test_cases = load_test_cases()
    if categories:
        test_cases = [tc for tc in test_cases if tc["category"] in categories]
    
    print(f"Benchmarking {len(models_to_run)} models on {len(test_cases)} test cases...")
    print(f"Models: {', '.join(models_to_run)}")
    print()
    
    all_results = []
    
    for model_name in models_to_run:
        if model_name not in MODELS:
            print(f"Unknown model: {model_name}")
            continue
        
        model_config = MODELS[model_name]
        print(f"\n{'='*60}")
        print(f"Benchmarking: {model_name}")
        print(f"{'='*60}")
        
        results = run_benchmark(model_name, model_config, test_cases)
        all_results.extend(results)
        
        # Save intermediate results
        with open(RESULTS_DIR / f"{model_name.replace(':', '_')}_results.json", "w") as f:
            json.dump(results, f, indent=2)
    
    # Generate report
    report = generate_report(all_results)
    with open(RESULTS_DIR / "benchmark_report.json", "w") as f:
        json.dump(report, f, indent=2)
    
    # Print summary
    print(f"\n{'='*60}")
    print("BENCHMARK SUMMARY")
    print(f"{'='*60}")
    for model, data in report["models"].items():
        print(f"\n{model}:")
        print(f"  Overall Score: {data['overall_score']}/100")
        print(f"  Avg Speed: {data['avg_tok_per_sec']} tok/s")
        print(f"  Total Time: {data['total_time']}s")
        for cat, score in data["category_scores"].items():
            print(f"    {cat}: {score}/100")
    
    print(f"\nResults saved to: {RESULTS_DIR}/")


if __name__ == "__main__":
    main()