#!/usr/bin/env node
/**
 * validate-ecosystem.mjs — Structural audit for cursor-md
 * Usage: node scripts/validate-ecosystem.mjs --root .
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const args = process.argv.slice(2);
const rootIdx = args.indexOf('--root');
const ROOT = rootIdx >= 0 ? args[rootIdx + 1] : '.';

const errors = [];
const warnings = [];

function parseFrontmatter(content) {
  const cleaned = content.replace(/^\uFEFF/, '');
  const m = cleaned.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    if (key) fm[key] = val;
  }
  return fm;
}

function checkSkill(skillDir, { allowGen = false } = {}) {
  const skillMd = join(skillDir, 'SKILL.md');
  if (!existsSync(skillMd)) {
    errors.push(`Missing SKILL.md: ${relative(ROOT, skillDir)}`);
    return;
  }
  const content = readFileSync(skillMd, 'utf8');
  if (content.split('\n').length > 500) {
    errors.push(`SKILL.md >500 lines: ${relative(ROOT, skillMd)}`);
  }
  const fm = parseFrontmatter(content);
  if (!fm) {
    errors.push(`No frontmatter: ${relative(ROOT, skillMd)}`);
    return;
  }
  if (!fm.name || !/^[a-z0-9-]+$/.test(fm.name)) {
    errors.push(`Invalid name in ${relative(ROOT, skillMd)}: ${fm.name}`);
  }
  if (allowGen && fm.name && !fm.name.startsWith('gen-')) {
    errors.push(`Generated skill name must start with gen-: ${relative(ROOT, skillMd)}`);
  }
  if (allowGen && fm['x-origin'] !== 'auto-mint') {
    warnings.push(`Generated skill missing x-origin: auto-mint: ${relative(ROOT, skillMd)}`);
  }
  if (!fm.description || fm.description.length < 20) {
    errors.push(`Description too short: ${relative(ROOT, skillMd)}`);
  }
  if (
    !fm.description.includes('Use when') &&
    !fm.description.includes('Use for') &&
    !fm.description.includes('Use after')
  ) {
    warnings.push(`Description missing 'Use when': ${relative(ROOT, skillMd)}`);
  }
  const rel = relative(ROOT, skillDir);
  const isCore =
    (rel.includes('ecosystem/skills') || rel.includes('ecosystem\\skills')) &&
    !rel.includes('generated');
  if (isCore && /\bmcp__\w+/.test(content)) {
    errors.push(`Core skill references mcp__: ${relative(ROOT, skillMd)}`);
  }
}

function checkRule(rulePath) {
  const content = readFileSync(rulePath, 'utf8');
  if (content.includes('mcp__')) errors.push(`Rule references mcp__: ${relative(ROOT, rulePath)}`);
  if (!content.startsWith('---')) warnings.push(`Rule missing frontmatter: ${relative(ROOT, rulePath)}`);
}

function main() {
  const skillsRoot = join(ROOT, 'ecosystem', 'skills');
  const rulesDir = join(ROOT, 'ecosystem', 'rules');
  const agentsMd = join(ROOT, 'AGENTS.md');

  if (existsSync(skillsRoot)) {
    for (const name of readdirSync(skillsRoot)) {
      if (name === 'generated') continue;
      const p = join(skillsRoot, name);
      if (statSync(p).isDirectory()) checkSkill(p);
    }
  }

  const genRoot = join(skillsRoot, 'generated');
  if (existsSync(genRoot)) {
    for (const name of readdirSync(genRoot)) {
      const p = join(genRoot, name);
      if (!statSync(p).isDirectory()) continue;
      if (!existsSync(join(p, 'SKILL.md'))) continue;
      checkSkill(p, { allowGen: true });
    }
  }

  for (const packDir of [
    join(ROOT, 'ecosystem', 'packs', 'security'),
    join(ROOT, 'ecosystem', 'packs', 'testing'),
  ]) {
    if (!existsSync(packDir)) continue;
    for (const name of readdirSync(packDir)) {
      const p = join(packDir, name);
      if (statSync(p).isDirectory()) checkSkill(p);
    }
  }

  if (existsSync(rulesDir)) {
    for (const f of readdirSync(rulesDir).filter((f) => f.endsWith('.mdc'))) {
      checkRule(join(rulesDir, f));
    }
    if (existsSync(join(rulesDir, 'model-routing.mdc'))) {
      errors.push('model-routing.mdc must be removed');
    }
  }

  if (existsSync(agentsMd)) {
    const ag = readFileSync(agentsMd, 'utf8');
    if (ag.includes('mcp__')) errors.push('AGENTS.md references mcp__');
    if (/gpt-5\.6-(luna|terra|sol)/.test(ag)) {
      errors.push('AGENTS.md still contains model-lane slugs (remove model routing)');
    }
  } else {
    errors.push('Missing AGENTS.md');
  }

  if (existsSync(join(ROOT, 'LEARNINGS.md'))) {
    errors.push('LEARNINGS.md must be removed');
  }
  if (existsSync(join(skillsRoot, 'capture-learning'))) {
    errors.push('capture-learning skill must be removed');
  }

  const requiredSkills = [
    'pre-code-gate',
    'sparc-lite',
    'explore-before-code',
    'minimal-diff',
    'write-tests',
    'validate-changes',
    'optimize-code',
    'code-review',
    'subagent-orchestration',
    'auto-skill-mint',
    'audit-generated-skills',
    'skill-builder',
  ];
  for (const s of requiredSkills) {
    if (!existsSync(join(skillsRoot, s, 'SKILL.md'))) {
      errors.push(`Missing required skill: ${s}`);
    }
  }

  const requiredRules = [
    'core-principles.mdc',
    'pre-code-gate.mdc',
    'token-efficiency.mdc',
    'mcp-on-demand.mdc',
  ];
  for (const r of requiredRules) {
    if (!existsSync(join(rulesDir, r))) errors.push(`Missing required rule: ${r}`);
  }

  console.log('validate-ecosystem.mjs');
  console.log('  root:', ROOT);
  if (warnings.length) {
    console.log(`\nWarnings (${warnings.length}):`);
    warnings.forEach((w) => console.log('  ⚠', w));
  }
  if (errors.length) {
    console.log(`\nErrors (${errors.length}):`);
    errors.forEach((e) => console.log('  ✗', e));
    process.exit(1);
  }
  console.log('\nAll checks passed.');
}

main();
