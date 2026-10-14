#!/usr/bin/env bash
set -euo pipefail
PROJECT_NAME="${1:-}"
if [[ -z "$PROJECT_NAME" ]]; then echo "Usage: power-new ProjectName" >&2; exit 1; fi
if [[ ! "$PROJECT_NAME" =~ ^[A-Za-z0-9._-]+$ ]]; then echo "Use letters, numbers, dots, underscores, or hyphens in the project name." >&2; exit 1; fi
if [[ -e "$PROJECT_NAME" ]]; then echo "Error: '$PROJECT_NAME' already exists." >&2; exit 1; fi
command -v curl >/dev/null || { echo "curl is required." >&2; exit 1; }
command -v unzip >/dev/null || { echo "unzip is required. Install it and retry." >&2; exit 1; }
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
echo "Downloading P.O.W.E.R. 2.0..."
curl -fL --retry 2 "https://github.com/OrpanAp/power-2.0/archive/refs/heads/main.zip" -o "$TMP/power.zip"
mkdir "$PROJECT_NAME"
unzip -q "$TMP/power.zip" -d "$TMP/source"
SOURCE_DIR="$(find "$TMP/source" -mindepth 1 -maxdepth 1 -type d | head -n 1)"
if [[ -z "$SOURCE_DIR" ]]; then echo "Could not locate the downloaded project files." >&2; rmdir "$PROJECT_NAME"; exit 1; fi
cp -R "$SOURCE_DIR"/. "$PROJECT_NAME"/
echo "Created '$PROJECT_NAME'."
echo "Next steps:"
echo "  cd \"$PROJECT_NAME\""
echo "  cp .env.example .env"
echo "  node bin/power-cli.js serve"
