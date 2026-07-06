#!/usr/bin/env node
/**
 * prune-learnings.mjs — Dedup and cap LEARNINGS.md entries
 * Usage:
 *   node prune-learnings.mjs --dry-run
 *   node prune-learnings.mjs --apply
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';

const MAX_ENTRIES = 80;
const LEARNINGS_MD = join(homedir(), '.cursor', 'LEARNINGS.md');

function parseArgs() {
  return { apply: process.argv.includes('--apply'), dryRun: process.argv.includes('--dry-run') || !process.argv.includes('--apply') };
}

function hashPattern(line) {
  const m = line.match(/(?:pattern|anti-pattern|preference): (.+?) \|/);
  return createHash('sha256').update(m?.[1] || line).digest('hex').slice(0, 12);
}

function main() {
  const opts = parseArgs();
  if (!existsSync(LEARNINGS_MD)) {
    console.log('LEARNINGS.md not found.');
    return;
  }

  const lines = readFileSync(LEARNINGS_MD, 'utf8').split('\n');
  const sections = { header: [], patterns: [], anti: [], tools: [], rest: [] };
  let current = 'header';

  for (const line of lines) {
    if (line.startsWith('## Patterns')) { current = 'patterns'; sections.patterns.push(line); continue; }
    if (line.startsWith('## Anti-patterns')) { current = 'anti'; sections.anti.push(line); continue; }
    if (line.startsWith('## Tool preferences')) { current = 'tools'; sections.tools.push(line); continue; }
    if (line.startsWith('## ') && current !== 'header') { current = 'rest'; sections.rest.push(line); continue; }
    sections[current === 'header' ? 'header' : current].push(line);
  }

  function dedupSection(sectionLines) {
    const seen = new Set();
    const kept = [];
    const removed = [];
    for (const line of sectionLines) {
      if (!line.trim().startsWith('- [')) {
        kept.push(line);
        continue;
      }
      const h = hashPattern(line);
      if (seen.has(h)) {
        removed.push(line);
        continue;
      }
      seen.add(h);
      kept.push(line);
    }
    return { kept, removed };
  }

  const p = dedupSection(sections.patterns);
  const a = dedupSection(sections.anti);
  const t = dedupSection(sections.tools);

  let allEntries = [...p.kept, ...a.kept, ...t.kept].filter((l) => l.trim().startsWith('- ['));
  const entryLines = allEntries;
  let capRemoved = [];

  if (entryLines.length > MAX_ENTRIES) {
    const toRemove = entryLines.length - MAX_ENTRIES;
    capRemoved = entryLines.slice(0, toRemove);
    const capSet = new Set(capRemoved);
    const capFilter = (lines) => lines.filter((l) => !capSet.has(l));
    p.kept = capFilter(p.kept);
    a.kept = capFilter(a.kept);
    t.kept = capFilter(t.kept);
  }

  const removed = [...p.removed, ...a.removed, ...t.removed, ...capRemoved];
  console.log(`Entries: ${entryLines.length} → max ${MAX_ENTRIES}`);
  console.log(`Duplicates removed: ${p.removed.length + a.removed.length + t.removed.length}`);
  console.log(`Cap removed: ${capRemoved.length}`);

  if (removed.length && opts.dryRun) {
    console.log('\nWould remove:');
    removed.forEach((l) => console.log(' ', l.slice(0, 80)));
    console.log('\nRun with --apply to write changes.');
    return;
  }

  if (opts.apply && removed.length) {
    const out = [
      ...sections.header,
      ...p.kept,
      ...a.kept,
      ...t.kept,
      ...sections.rest,
    ].join('\n');
    writeFileSync(LEARNINGS_MD, out);
    try {
      execSync(`node "${join(homedir(), '.cursor', 'scripts', 'search-learnings.mjs')}" --sync`, { stdio: 'inherit' });
    } catch { /* sync optional */ }
    console.log('Applied prune.');
  } else if (!removed.length) {
    console.log('Nothing to prune.');
  }
}

main();
