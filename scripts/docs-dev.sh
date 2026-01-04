#!/usr/bin/env bash
set -euo pipefail

# Run Jekyll locally using Gemfile.local + local config overrides.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR/docs"

export BUNDLE_GEMFILE="Gemfile.local"

# Install/update gems for the local Gemfile
bundle install

# Serve the docs site
bundle exec jekyll serve \
  --config _config.yml,_config.local.yml \
  --port "${PORT:-4000}" \
  --host "${HOST:-127.0.0.1}"
