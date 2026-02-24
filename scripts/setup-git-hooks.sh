#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

git -C "${repo_root}" config core.hooksPath .githooks
git -C "${repo_root}" config commit.template .gitmessage

echo "Configured Git hooks and commit template for ${repo_root}"
echo "- core.hooksPath=.githooks"
echo "- commit.template=.gitmessage"
