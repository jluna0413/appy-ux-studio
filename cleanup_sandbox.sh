#!/bin/bash
# Dev Sandbox Cleanup — Appy-UX Studio
# Removes a worktree and its branch after merge
# Usage: ./cleanup_sandbox.sh <task-name>

set -euo pipefail

TASK_NAME="${1:-}"
REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
WORKTREE_DIR="$REPO_ROOT/.worktrees"
SANDBOX_NAME="sandbox-$TASK_NAME"
BRANCH_NAME="feature/$TASK_NAME"
WORKTREE_PATH="$WORKTREE_DIR/$SANDBOX_NAME"

if [ -z "$TASK_NAME" ]; then
    echo "Usage: $0 <task-name>"
    echo "Example: $0 fix-slider-glitch"
    exit 1
fi

if [ ! -d "$WORKTREE_PATH" ]; then
    echo "ERROR: Worktree not found at $WORKTREE_PATH"
    exit 1
fi

echo "Removing worktree: $WORKTREE_PATH"
git worktree remove "$WORKTREE_PATH" --force

echo "Deleting branch: $BRANCH_NAME"
git branch -D "$BRANCH_NAME" 2>/dev/null || echo "Branch already deleted"

echo "Pruning worktree records..."
git worktree prune

echo "Cleanup complete!"
echo "Remaining worktrees:"
git worktree list