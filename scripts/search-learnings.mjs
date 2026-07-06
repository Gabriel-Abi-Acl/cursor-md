#!/usr/bin/env node
/**
 * search-learnings.mjs — Query and sync learnings index (sqlite with JSON fallback)
 * Usage:
 *   node search-learnings.mjs --init
 *   node search-learnings.mjs --query "adapter pattern"
 *   node search-learnings.mjs --sync
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';

const CURSOR_HOME = join(homedir(), '.cursor');
const LEARNINGS_MD = join(CURSOR_HOME, 'LEARNINGS.md');
const INDEX_JSON = join(CURSOR_HOME, 'learnings-index.json');
const DB_PATH = join(CURSOR_HOME, 'learnings.db');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { init: false, sync: false, query: '' };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--init') opts.init = true;
    if (args[i] === '--sync') opts.sync = true;
    if (args[i] === '--query') opts.query = args[++i] || '';
  }
  return opts;
}

function parseLearningsMd(content) {
  const entries = [];
  const lineRe = /^- \[\d{4}-\d{2}-\d{2}\] (pattern|anti-pattern|preference): (.+?) \| context: (.+?) \| evidence: (.+?)(?: \| confidence: (high|medium))?$/;
  for (const line of content.split('\n')) {
    const m = line.trim().match(lineRe);
    if (!m) continue;
    const [, type, pattern, context, evidence, confidence = 'medium'] = m;
    const text = `${pattern} ${context} ${evidence}`.toLowerCase();
    const tags = [...new Set(text.match(/[a-z]{4,}/g) || [])].slice(0, 20);
    entries.push({
      id: createHash('sha256').update(line).digest('hex').slice(0, 16),
      type,
      pattern,
      context,
      evidence,
      confidence,
      tags,
      raw: line.trim(),
    });
  }
  return entries;
}

function loadIndex() {
  if (!existsSync(INDEX_JSON)) return { version: 1, entries: [] };
  return JSON.parse(readFileSync(INDEX_JSON, 'utf8'));
}

function saveIndex(data) {
  mkdirSync(dirname(INDEX_JSON), { recursive: true });
  writeFileSync(INDEX_JSON, JSON.stringify(data, null, 2));
}

async function initDb(entries) {
  try {
    const { DatabaseSync } = await import('node:sqlite');
    const db = new DatabaseSync(DB_PATH);
    db.exec(`
      CREATE TABLE IF NOT EXISTS learnings (
        id TEXT PRIMARY KEY,
        type TEXT,
        pattern TEXT,
        context TEXT,
        evidence TEXT,
        confidence TEXT,
        tags TEXT,
        raw TEXT
      );
    `);
    db.exec('DELETE FROM learnings');
    const insert = db.prepare(
      'INSERT INTO learnings (id, type, pattern, context, evidence, confidence, tags, raw) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    for (const e of entries) {
      insert.run(e.id, e.type, e.pattern, e.context, e.evidence, e.confidence, e.tags.join(','), e.raw);
    }
    db.close();
    return true;
  } catch {
    return false;
  }
}

function searchJson(entries, query) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return entries;
  return entries
    .map((e) => {
      const hay = `${e.pattern} ${e.context} ${e.evidence} ${e.tags.join(' ')}`.toLowerCase();
      const score = terms.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0);
      return { ...e, score };
    })
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score);
}

async function searchSqlite(query) {
  try {
    const { DatabaseSync } = await import('node:sqlite');
    const db = new DatabaseSync(DB_PATH, { readOnly: true });
    const rows = db.prepare(
      `SELECT * FROM learnings WHERE pattern LIKE ? OR context LIKE ? OR evidence LIKE ? OR tags LIKE ?`
    ).all(`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`);
    db.close();
    return rows;
  } catch {
    return null;
  }
}

async function main() {
  const opts = parseArgs();

  if (opts.init) {
    mkdirSync(CURSOR_HOME, { recursive: true });
    if (!existsSync(LEARNINGS_MD)) {
      writeFileSync(LEARNINGS_MD, '# Agent Learnings (Curated)\n\n## Patterns\n\n## Anti-patterns\n\n## Tool preferences\n\n');
    }
    saveIndex({ version: 1, entries: [] });
    await initDb([]);
    console.log('Initialized:', INDEX_JSON);
    return;
  }

  if (opts.sync) {
    if (!existsSync(LEARNINGS_MD)) {
      console.error('LEARNINGS.md not found:', LEARNINGS_MD);
      process.exit(1);
    }
    const content = readFileSync(LEARNINGS_MD, 'utf8');
    const entries = parseLearningsMd(content);
    saveIndex({ version: 1, updated: new Date().toISOString(), entries });
    const sqliteOk = await initDb(entries);
    console.log(`Synced ${entries.length} entries${sqliteOk ? ' (+ sqlite)' : ' (json only)'}`);
    return;
  }

  if (opts.query) {
    const index = loadIndex();
    let results = searchJson(index.entries, opts.query);
    if (existsSync(DB_PATH)) {
      const sqliteResults = await searchSqlite(opts.query);
      if (sqliteResults?.length) results = sqliteResults.map((r) => ({ ...r, score: 1 }));
    }
    if (!results.length) {
      // Fallback grep LEARNINGS.md
      if (existsSync(LEARNINGS_MD)) {
        const lines = readFileSync(LEARNINGS_MD, 'utf8').split('\n');
        results = lines
          .filter((l) => l.startsWith('- [') && l.toLowerCase().includes(opts.query.toLowerCase()))
          .map((raw) => ({ raw, score: 1 }));
      }
    }
    if (!results.length) {
      console.log('No matches.');
      return;
    }
    for (const r of results.slice(0, 10)) {
      console.log(r.raw || `- ${r.type}: ${r.pattern} | ${r.context}`);
    }
    return;
  }

  console.log('Usage: --init | --sync | --query "keywords"');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
