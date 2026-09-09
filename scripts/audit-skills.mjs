#!/usr/bin/env node
/**
 * audit-skills.mjs — Inventory gen-* / auto-mint skills
 * Usage:
 *   node scripts/audit-skills.mjs
 *   node scripts/audit-skills.mjs --root .
 *   node scripts/audit-skills.mjs --cursor-only
 *   node scripts/audit-skills.mjs --stale-days 90
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const args = process.argv.slice(2);
function arg(name, def) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
}
const ROOT = arg('--root', null);
const STALE_DAYS = Number(arg('--stale-days', '90'));
const CURSOR_ONLY = args.includes('--cursor-only');
const BUDGET = 25;

function parseFrontmatter(content) {
  const cleaned = content.replace(/^\uFEFF/, '');
  const m = cleaned.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    fm[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return fm;
}

function daysSince(iso) {
  if (!iso) return Infinity;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return Infinity;
  return (Date.now() - t) / (1000 * 60 * 60 * 24);
}

function collectFromDir(base, skills = []) {
  if (!existsSync(base)) return skills;
  for (const name of readdirSync(base)) {
    const dir = join(base, name);
    if (!statSync(dir).isDirectory()) continue;
    if (name === 'generated') {
      collectFromDir(dir, skills);
      continue;
    }
    const skillMd = join(dir, 'SKILL.md');
    if (!existsSync(skillMd)) continue;
    const content = readFileSync(skillMd, 'utf8');
    const fm = parseFrontmatter(content);
    if (!fm) continue;
    const isGen =
      (fm.name && fm.name.startsWith('gen-')) ||
      fm['x-origin'] === 'auto-mint' ||
      name.startsWith('gen-');
    if (!isGen) continue;
    const useCount = Number(fm['x-use-count'] || 0);
    const lastUsed = (fm['x-last-used'] || '').replace(/['"]/g, '');
    const days = daysSince(lastUsed);
    let klass = 'active';
    if (useCount === 0 || days > STALE_DAYS) klass = 'stale';
    skills.push({
      path: skillMd,
      name: fm.name || name,
      useCount,
      lastUsed: lastUsed || 'never',
      created: fm['x-created'] || '?',
      class: klass,
      description: (fm.description || '').slice(0, 80),
    });
  }
  return skills;
}

function main() {
  const found = [];
  if (!CURSOR_ONLY && ROOT) {
    collectFromDir(join(ROOT, 'ecosystem', 'skills'), found);
    collectFromDir(join(ROOT, 'ecosystem', 'skills', 'generated'), found);
  }
  collectFromDir(join(homedir(), '.cursor', 'skills'), found);

  // Dedupe by name
  const byName = new Map();
  for (const s of found) {
    if (!byName.has(s.name)) byName.set(s.name, s);
  }
  const list = [...byName.values()];

  console.log('audit-skills.mjs');
  console.log(`  budget: ${list.length} / ${BUDGET} gen-* skills`);
  console.log(`  stale threshold: ${STALE_DAYS} days\n`);

  if (!list.length) {
    console.log('No generated skills found.');
    return;
  }

  for (const s of list) {
    console.log(
      `[${s.class}] ${s.name} | uses=${s.useCount} | last=${s.lastUsed} | created=${s.created}`
    );
    console.log(`  ${s.path}`);
    if (s.description) console.log(`  ${s.description}...`);
  }

  const stale = list.filter((s) => s.class === 'stale');
  console.log(`\nSummary: active=${list.length - stale.length} stale=${stale.length}`);
  if (stale.length) {
    console.log('Stale candidates (delete only after user confirm):');
    stale.forEach((s) => console.log(`  - ${s.name}`));
  }
  if (list.length > BUDGET) {
    console.log(`\nWARNING: over budget (${list.length} > ${BUDGET})`);
    process.exitCode = 2;
  }
}

main();
