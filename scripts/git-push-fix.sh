#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# Remove tracked build artifacts and update gitignore
echo "Removing tracked build artifacts from index (if present)"
git rm -r --cached client/dist || true
git rm -r --cached dist || true
# Ensure gitignore is staged
git add .gitignore || true
git add .gitattributes .gitmessage scripts/README.md || true
git status --porcelain || true
if git commit -m "Remove build artifacts from repo and ignore dist" --quiet; then
  echo "Committed removal of build artifacts"
else
  echo "No changes to commit"
fi

echo "Now attempting push..."

echo "Now attempting push..."
# Try pushing; retry on transient network errors
for i in 1 2 3; do
  if git push --set-upstream origin main --force-with-lease --quiet; then
    echo "Push succeeded"
    exit 0
  else
    echo "Push attempt $i failed, retrying in 5s..."
    sleep 5
  fi
done
echo "Push failed after retries"
exit 1
