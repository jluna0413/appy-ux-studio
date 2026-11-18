# Model Benchmark Dashboard — Design Document

**Date:** 2026-11-26
**Status:** DESIGN PHASE

---

## 1. Purpose

Benchmark coding models (local + cloud) on standardized tasks to determine which model is best for which job. Results are stored and reported in a dashboard for the owner to review.

## 2. Benchmark Categories

### Category A: Code Generation
- **Task:** Given a spec, generate working code
- **Metrics:** Correctness (does it run?), completeness (all requirements met?), speed (tok/s)
- **Test cases:**
  1. FastAPI endpoint with CRUD operations
  2. React component with state management
  3. Python data processing script
  4. SQL query generation
  5. HTML/CSS layout from description

### Category B: Code Review
- **Task:** Review code for bugs, security issues, style
- **Metrics:** Issues found (true positives), false positives, speed
- **Test cases:**
  1. SQL injection vulnerability
  2. XSS vulnerability
  3. Off-by-one error
  4. Memory leak
  5. Style violation

### Category C: Bug Fixing
- **Task:** Given broken code + error, fix it
- **Metrics:** Fix correctness, speed, explanation quality
- **Test cases:**
  1. TypeError in Python
  2. Null reference in JavaScript
  3. Race condition
  4. Off-by-one in loop
  5. Missing import

### Category D: Documentation
- **Task:** Generate docstrings, README, API docs
- **Metrics:** Completeness, accuracy, readability, speed
- **Test cases:**
  1. Function docstring
  2. Class documentation
  3. API endpoint docs
  4. README generation
  5. Inline comments

### Category E: Refactoring
- **Task:** Improve code quality without changing behavior
- **Metrics:** Behavior preserved, quality improved, speed
- **Test cases:**
  1. Extract method
  2. Remove duplication
  3. Simplify conditional
  4. Rename for clarity
  5. Add type hints

## 3. Scoring System

### Per-Task Score (0-100)
- **Correctness (40%):** Does the output work? (automated test)
- **Completeness (20%):** All requirements addressed? (LLM judge)
- **Quality (20%):** Code quality, style, best practices (LLM judge)
- **Speed (20%):** Tokens per second (normalized)

### Model Score (0-100)
- Average across all tasks in all categories
- Weighted by category importance:
  - Code Generation: 30%
  - Code Review: 20%
  - Bug Fixing: 20%
  - Documentation: 15%
  - Refactoring: 15%

### Benchmark Report
- Model name, size, quantization
- Per-category scores
- Per-task scores with details
- Speed (tok/s) per task
- Memory usage (RAM/VRAM)
- Total time
- Cost per task (for cloud models)
- Recommendation (best for which job)

## 4. Dashboard Design

### 4.1 Overview Page
- Grid of model cards with overall score
- Color coding: green (90+), yellow (70-89), red (<70)
- Quick filters: by size, by license, by category

### 4.2 Model Detail Page
- Model info (name, size, quant, license, source)
- Per-category radar chart
- Per-task breakdown table
- Speed vs quality scatter plot
- Cost comparison (for cloud models)

### 4.3 Comparison Page
- Side-by-side model comparison
- Select 2-4 models to compare
- Category-by-category breakdown
- Winner highlighted per category

### 4.4 Benchmark Runner
- Select models to benchmark
- Select categories to run
- Progress bar per model per task
- Real-time results streaming

### 4.5 Report Export
- JSON (machine-readable)
- Markdown (human-readable)
- CSV (spreadsheet)
- PDF (presentation)

## 5. Implementation Plan

### Phase 1: Benchmark Runner (Python)
- Create `benchmarks/` directory
- `benchmark_runner.py` — runs tests against models
- `test_cases/` — JSON files with test specs
- `scoring.py` — automated + LLM judge scoring
- `report_generator.py` — generates reports

### Phase 2: Dashboard (HTML/JS)
- Static HTML dashboard (no backend needed)
- Reads JSON reports from `benchmarks/results/`
- Chart.js for visualizations
- Responsive design

### Phase 3: Integration
- Add to OpenCode/Codex workflow
- Automatic benchmarking on model change
- Alert when a model scores below threshold

## 6. Test Case Format

```json
{
  "id": "codegen-001",
  "category": "code_generation",
  "difficulty": "medium",
  "prompt": "Create a FastAPI endpoint that...",
  "expected_output": {
    "must_contain": ["@app.get", "def ", "return"],
    "must_not_contain": ["TODO", "pass"],
    "test_command": "python -c 'import ...; ...'",
    "test_expected": "success"
  },
  "scoring": {
    "correctness_weight": 0.4,
    "completeness_weight": 0.2,
    "quality_weight": 0.2,
    "speed_weight": 0.2
  }
}
```

## 7. LLM Judge

For subjective scoring (quality, completeness), use a separate LLM as judge:
- **Judge model:** Qwen3.8-27B (best quality per GB)
- **Judge prompt:** "Rate this code on quality (0-100) and completeness (0-100). Explain your reasoning."
- **Judge output:** JSON with scores and reasoning

## 8. Benchmark Execution

### Per-Model Flow
```
1. Load model (LM Studio or Ollama)
2. For each test case:
   a. Send prompt to model
   b. Measure time and token count
   c. Run automated tests (if applicable)
   d. Send output to LLM judge for subjective scoring
   e. Calculate per-task score
3. Calculate per-category and overall scores
4. Generate report
5. Unload model
6. Move to next model
```

### Execution Time
- 5 categories × 5 tasks × ~30s per task = ~12.5 min per model
- 6 models = ~75 min total
- Run overnight or during low-usage periods

## 9. Files to Create

| File | Purpose |
|------|---------|
| `benchmarks/benchmark_runner.py` | Main runner script |
| `benchmarks/test_cases/` | JSON test case files |
| `benchmarks/scoring.py` | Scoring logic |
| `benchmarks/llm_judge.py` | LLM judge integration |
| `benchmarks/report_generator.py` | Report generation |
| `benchmarks/dashboard.html` | Results dashboard |
| `benchmarks/results/` | JSON result files |
| `benchmarks/reports/` | Markdown/PDF reports |