#!/usr/bin/env node
/**
 * cost-log.mjs — Local JSONL for gate levels (optional)
 * Usage:
 *   node cost-log.mjs --event gate --level 1
 *   node cost-log.mjs --tail
 */
import { appendFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';

const LOG_PATH = join(homedir(), '.cursor', 'cost-log.jsonl');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { event: '', level: '', tail: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--event') opts.event = args[++i];
    if (args[i] === '--level') opts.level = args[++i];
    if (args[i] === '--tail') opts.tail = true;
  }
  return opts;
}

function main() {
  const opts = parseArgs();
  mkdirSync(dirname(LOG_PATH), { recursive: true });

  if (opts.tail) {
    if (!existsSync(LOG_PATH)) {
      console.log('No log entries.');
      return;
    }
    readFileSync(LOG_PATH, 'utf8').trim().split('\n').slice(-20).forEach((l) => console.log(l));
    return;
  }

  if (!opts.event) {
    console.log('Usage: --event gate [--level N] | --tail');
    return;
  }

  const entry = {
    ts: new Date().toISOString(),
    event: opts.event,
    ...(opts.level && { gate_level: opts.level }),
  };
  appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n');
  console.log('Logged:', JSON.stringify(entry));
}

main();
