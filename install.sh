#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CURSOR_HOME="${HOME}/.cursor"
FORCE="${1:-}"

echo "cursor-md ecosystem install"
echo "  target: ${CURSOR_HOME}"

mkdir -p "${CURSOR_HOME}/rules"
mkdir -p "${CURSOR_HOME}/skills"
mkdir -p "${CURSOR_HOME}/agents"
mkdir -p "${CURSOR_HOME}/scripts"
mkdir -p "${CURSOR_HOME}/hooks"

cp -r "${REPO_ROOT}/ecosystem/rules/"* "${CURSOR_HOME}/rules/" 2>/dev/null || true

install_skills() {
  local src="$1"
  [ -d "$src" ] || return
  for dir in "$src"/*/; do
    [ -d "$dir" ] || continue
    name="$(basename "$dir")"
    if [ -d "${CURSOR_HOME}/skills/${name}" ] && [ "$FORCE" != "--force" ]; then
      echo "  skill exists (skip): ${name}"
    else
      mkdir -p "${CURSOR_HOME}/skills/${name}"
      cp -r "${dir}"* "${CURSOR_HOME}/skills/${name}/"
      echo "  skill: ${name}"
    fi
  done
}

install_skills "${REPO_ROOT}/ecosystem/skills"
install_skills "${REPO_ROOT}/ecosystem/packs/security"
install_skills "${REPO_ROOT}/ecosystem/packs/testing"

cp -r "${REPO_ROOT}/ecosystem/agents/"* "${CURSOR_HOME}/agents/" 2>/dev/null || true
cp "${REPO_ROOT}/AGENTS.md" "${CURSOR_HOME}/AGENTS.md"

if [ -f "${CURSOR_HOME}/LEARNINGS.md" ] && [ "$FORCE" != "--force" ]; then
  echo "  LEARNINGS.md exists (skipped)"
else
  cp "${REPO_ROOT}/LEARNINGS.md" "${CURSOR_HOME}/LEARNINGS.md"
  echo "  LEARNINGS.md installed"
fi

cp -r "${REPO_ROOT}/scripts/"* "${CURSOR_HOME}/scripts/"
cp -r "${REPO_ROOT}/ecosystem/hooks/"* "${CURSOR_HOME}/hooks/"

if [ -f "${CURSOR_HOME}/scripts/search-learnings.mjs" ]; then
  node "${CURSOR_HOME}/scripts/search-learnings.mjs" --init || true
fi

if [ -f "${REPO_ROOT}/ecosystem/hooks/hooks.json" ]; then
  if [ -f "${CURSOR_HOME}/hooks.json" ]; then
    echo "  hooks.json: manual merge recommended (existing file present)"
  else
    cp "${REPO_ROOT}/ecosystem/hooks/hooks.json" "${CURSOR_HOME}/hooks.json"
    echo "  hooks.json installed"
  fi
fi

echo ""
echo "Done. Restart Cursor to load rules and skills."
