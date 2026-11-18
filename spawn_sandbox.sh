#!/bin/bash
# Dev Sandbox Spawner — Appy-UX Studio
# Creates isolated git worktrees for agent development
# Usage: ./spawn_sandbox.sh <task-name> [branch-from]
#
# Example: ./spawn_sandbox.sh fix-slider-glitch main

set -euo pipefail

TASK_NAME="${1:-}"
BRANCH_FROM="${2:-main}"
REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
WORKTREE_DIR="$REPO_ROOT/.worktrees"
SANDBOX_NAME="sandbox-$TASK_NAME"
BRANCH_NAME="feature/$TASK_NAME"
WORKTREE_PATH="$WORKTREE_DIR/$SANDBOX_NAME"

if [ -z "$TASK_NAME" ]; then
    echo "Usage: $0 <task-name> [branch-from]"
    echo "Example: $0 fix-slider-glitch main"
    exit 1
fi

# Check if worktree already exists
if [ -d "$WORKTREE_PATH" ]; then
    echo "ERROR: Worktree already exists at $WORKTREE_PATH"
    echo "Use: git worktree remove $WORKTREE_PATH"
    exit 1
fi

# Create worktree directory
mkdir -p "$WORKTREE_DIR"

# Create worktree
echo "Creating worktree: $WORKTREE_PATH"
echo "Branch: $BRANCH_NAME (from $BRANCH_FROM)"
git worktree add -b "$BRANCH_NAME" "$WORKTREE_PATH" "$BRANCH_FROM"

# Set up sandbox environment
cd "$WORKTREE_PATH"

# Create .env from template
if [ -f "$REPO_ROOT/.env.example" ]; then
    cp "$REPO_ROOT/.env.example" "$WORKTREE_PATH/.env"
    echo "Created .env from template"
fi

# Install dependencies
if [ -f "$WORKTREE_PATH/backend/requirements.txt" ]; then
    echo "Installing Python dependencies..."
    python -m pip install -r "$WORKTREE_PATH/backend/requirements.txt" --quiet 2>/dev/null || echo "Warning: pip install failed"
fi

if [ -f "$WORKTREE_PATH/client-portal/package.json" ]; then
    echo "Installing Node dependencies (client-portal)..."
    (cd "$WORKTREE_PATH/client-portal" && npm install --silent 2>/dev/null) || echo "Warning: npm install failed"
fi

if [ -f "$WORKTREE_PATH/admin-dashboard/package.json" ]; then
    echo "Installing Node dependencies (admin-dashboard)..."
    (cd "$WORKTREE_PATH/admin-dashboard" && npm install --silent 2>/dev/null) || echo "Warning: npm install failed"
fi

# Create sandbox database
mkdir -p "$WORKTREE_PATH/data/databases"
if [ -f "$REPO_ROOT/data/databases/appyux_agency.db" ]; then
    cp "$REPO_ROOT/data/databases/appyux_agency.db" "$WORKTREE_PATH/data/databases/sandbox.db"
    echo "Created sandbox database from production"
fi

# Print summary
echo ""
echo "========================================="
echo "SANDBOX READY"
echo "========================================="
echo "Worktree:  $WORKTREE_PATH"
echo "Branch:    $BRANCH_NAME"
echo "Database:  $WORKTREE_PATH/data/databases/sandbox.db"
echo ""
echo "To work in this sandbox:"
echo "  cd $WORKTREE_PATH"
echo ""
echo "To run tests:"
echo "  cd $WORKTREE_PATH/backend && python -m pytest tests/ -v"
echo ""
echo "To clean up:"
echo "  git worktree remove $WORKTREE_PATH"
echo "  git branch -D $BRANCH_NAME"
echo "========================================="
