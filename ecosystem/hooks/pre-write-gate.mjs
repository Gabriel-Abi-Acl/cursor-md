#!/usr/bin/env node
/**
 * pre-write-gate.mjs — Fail-open hook scripts for cursor-md ecosystem
 * Reads JSON from stdin when invoked by Cursor hooks.
 */
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const event = process.argv[2] || 'unknown';

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function output(obj) {
  process.stdout.write(JSON.stringify(obj));
}

async function main() {
  let input = {};
  try {
    const raw = await readStdin();
    if (raw.trim()) input = JSON.parse(raw);
  } catch {
    /* fail-open */
  }

  const learningsPath = join(homedir(), '.cursor', 'LEARNINGS.md');

  switch (event) {
    case 'sessionStart':
      output({
        continue: true,
        additionalContext: existsSync(learningsPath)
          ? 'Memory-before: consider running search-learnings for non-trivial tasks. Read ~/.cursor/LEARNINGS.md if relevant.'
          : '',
      });
      break;

    case 'preToolUse':
      // Fail-open advisory — do not block
      output({ decision: 'allow' });
      break;

    case 'subagentStop':
      output({
        followupMessage: 'Ensure subagent returned a ~200-token structured summary, not a full transcript.',
      });
      break;

    default:
      output({ continue: true });
  }
}

main().catch(() => output({ continue: true }));
