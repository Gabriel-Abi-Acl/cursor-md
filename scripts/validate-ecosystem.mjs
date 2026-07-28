#!/usr/bin/env node
/**
 * validate-ecosystem.mjs — Structural audit for cursor-md ecosystem
 * Usage: node scripts/validate-ecosystem.mjs --root .
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const args = process.argv.slice(2);
const rootIdx = args.indexOf('--root');
const ROOT = rootIdx >= 0 ? args[rootIdx + 1] : '.';

const errors = [];
const warnings = [];

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, files);
    else files.push(p);
  }
  return files;
}

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

function checkSkill(skillDir) {
  const skillMd = join(skillDir, 'SKILL.md');
  if (!existsSync(skillMd)) {
    errors.push(`Missing SKILL.md: ${relative(ROOT, skillDir)}`);
    return;
  }
  const content = readFileSync(skillMd, 'utf8');
  const lines = content.split('\n').length;
  if (lines > 500) errors.push(`SKILL.md >500 lines: ${relative(ROOT, skillMd)} (${lines})`);

  const fm = parseFrontmatter(content);
  if (!fm) {
    errors.push(`No frontmatter: ${relative(ROOT, skillMd)}`);
    return;
  }
  if (!fm.name || !/^[a-z0-9-]+$/.test(fm.name)) {
    errors.push(`Invalid name in ${relative(ROOT, skillMd)}: ${fm.name}`);
  }
  if (!fm.description || fm.description.length < 20) {
    errors.push(`Description too short: ${relative(ROOT, skillMd)}`);
  }
  if (!fm.description.includes('Use when') && !fm.description.includes('Use for') && !fm.description.includes('Use after')) {
    warnings.push(`Description missing 'Use when': ${relative(ROOT, skillMd)}`);
  }

  const isCore = relative(ROOT, skillDir).includes('ecosystem\\skills') || relative(ROOT, skillDir).includes('ecosystem/skills');
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
  const packsDirs = [
    join(ROOT, 'ecosystem', 'packs', 'security'),
    join(ROOT, 'ecosystem', 'packs', 'testing'),
  ];
  const rulesDir = join(ROOT, 'ecosystem', 'rules');
  const agentsMd = join(ROOT, 'AGENTS.md');

  if (existsSync(skillsRoot)) {
    for (const name of readdirSync(skillsRoot)) {
      const p = join(skillsRoot, name);
      if (statSync(p).isDirectory()) checkSkill(p);
    }
  }
  for (const packDir of packsDirs) {
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
  }
  if (existsSync(agentsMd)) {
    const ag = readFileSync(agentsMd, 'utf8');
    if (ag.includes('mcp__')) errors.push('AGENTS.md references mcp__');
    const requiredSlugs = [
      'gpt-5.6-luna-medium',
      'gpt-5.6-terra-high',
      'gpt-5.6-sol-high',
      'gpt-5.6-sol-xhigh',
      'claude-opus-5-thinking-high',
    ];
    for (const slug of requiredSlugs) {
      if (!ag.includes(slug)) {
        errors.push(`AGENTS.md missing model slug: ${slug}`);
      }
    }
    if (!ag.includes('model:')) {
      warnings.push('AGENTS.md missing model: guidance');
    }
  } else {
    errors.push('Missing AGENTS.md');
  }

  const requiredSkills = [
    'pre-code-gate', 'sparc-lite', 'explore-before-code', 'minimal-diff',
    'write-tests', 'validate-changes', 'optimize-code', 'code-review',
    'subagent-orchestration', 'capture-learning', 'skill-builder',
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
    'model-routing.mdc',
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
