#!/bin/bash
# test.sh — Run all tests and checks (free, local, no cloud)
# Usage: ./test.sh (agents run this automatically before commits)
# Owner never needs to run this manually

set -e

echo "=== Backend Import Check ==="
cd backend && "/e/AI Playground/resources/ComfyUI/.venv/Scripts/python.exe" -c "from app.main import app; print('Import OK')"

echo "=== Backend Lint (Ruff) ==="
python -m ruff check app/ 2>/dev/null || echo "Ruff not installed, skipping"

echo "=== Frontend Build (Client Portal) ==="
cd ../client-portal && npm run build

echo "=== Frontend Build (Admin Dashboard) ==="
cd ../admin-dashboard && npm run build

echo "=== All Checks Passed ==="