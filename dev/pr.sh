#!/usr/bin/env bash
set -euo pipefail

if [[ ${1:-} == "" ]]; then
  echo "Usage: dev/pr.sh \"work description\""
  exit 1
fi

DESC="$1"
DATE_STR=$(date +%Y%m%d-%H%M)
SLUG=$(echo "$DESC" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g' | sed -E 's/^-+|-+$//g')
BRANCH="codex/${DATE_STR}-${SLUG}"

git checkout -b "$BRANCH"

echo "Switched to new branch: $BRANCH"
