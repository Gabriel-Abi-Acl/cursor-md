#!/usr/bin/env node
/**
 * pre-write-gate.mjs — Fail-open hooks for cursor-md
 */
async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function output(obj) {
  process.stdout.write(JSON.stringify(obj));
}

const event = process.argv[2] || 'unknown';

async function main() {
  try {
    const raw = await readStdin();
    if (raw.trim()) JSON.parse(raw);
  } catch {
    /* fail-open */
  }

  switch (event) {
    case 'sessionStart':
      output({
        continue: true,
        additionalContext:
          'If coding: apply pre-code-gate (or sparc-lite for large features). Prefer minimal-diff. Mint gen-* skills only after auto-skill-mint criteria pass.',
      });
      break;
    case 'preToolUse':
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
