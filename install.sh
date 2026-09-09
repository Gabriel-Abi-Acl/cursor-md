#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CURSOR_HOME="${HOME}/.cursor"
FORCE="${1:-}"

echo "cursor-md install"
echo "  target: ${CURSOR_HOME}"

mkdir -p "${CURSOR_HOME}/rules" "${CURSOR_HOME}/skills" "${CURSOR_HOME}/agents" \
  "${CURSOR_HOME}/scripts" "${CURSOR_HOME}/hooks"

cp -r "${REPO_ROOT}/ecosystem/rules/"* "${CURSOR_HOME}/rules/" 2>/dev/null || true

install_skill() {
  local src="$1"
  local dest_name="$2"
  [ -f "${src}/SKILL.md" ] || return 0
  local target="${CURSOR_HOME}/skills/${dest_name}"
  if [ -d "$target" ] && [ "$FORCE" != "--force" ]; then
    echo "  skill exists (skip): ${dest_name}"
  else
    mkdir -p "$target"
    cp -r "${src}/"* "$target/"
    echo "  skill: ${dest_name}"
  fi
}

for dir in "${REPO_ROOT}/ecosystem/skills"/*/; do
  [ -d "$dir" ] || continue
  name="$(basename "$dir")"
  [ "$name" = "generated" ] && continue
  install_skill "$dir" "$name"
done

if [ -d "${REPO_ROOT}/ecosystem/skills/generated" ]; then
  for dir in "${REPO_ROOT}/ecosystem/skills/generated"/*/; do
    [ -d "$dir" ] || continue
    name="$(basename "$dir")"
    [ -f "${dir}/SKILL.md" ] || continue
    case "$name" in
      gen-*) dest="$name" ;;
      *) dest="gen-${name}" ;;
    esac
    install_skill "$dir" "$dest"
  done
fi

install_skill "${REPO_ROOT}/ecosystem/packs/security/security-pack" "security-pack"
install_skill "${REPO_ROOT}/ecosystem/packs/testing/testing-pack" "testing-pack"

cp -r "${REPO_ROOT}/ecosystem/agents/"* "${CURSOR_HOME}/agents/" 2>/dev/null || true
cp "${REPO_ROOT}/AGENTS.md" "${CURSOR_HOME}/AGENTS.md"
echo "  LEARNINGS: not managed"

cp -r "${REPO_ROOT}/scripts/"* "${CURSOR_HOME}/scripts/"
cp -r "${REPO_ROOT}/ecosystem/hooks/"* "${CURSOR_HOME}/hooks/"

rm -f "${CURSOR_HOME}/rules/model-routing.mdc"
rm -rf "${CURSOR_HOME}/skills/capture-learning"

if [ -f "${REPO_ROOT}/ecosystem/hooks/hooks.json" ]; then
  if [ ! -f "${CURSOR_HOME}/hooks.json" ]; then
    cp "${REPO_ROOT}/ecosystem/hooks/hooks.json" "${CURSOR_HOME}/hooks.json"
    echo "  hooks.json installed"
  else
    echo "  hooks.json: merge manually if needed"
  fi
fi

echo ""
echo "Done. Restart Cursor to load rules and skills."
