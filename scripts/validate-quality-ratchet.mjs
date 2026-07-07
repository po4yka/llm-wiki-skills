import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { failFactory, readText, repoRoot } from './lib/repo.mjs';

const { fail, finish } = failFactory();
const baselinePath = path.join(repoRoot, 'quality-baseline.json');
const baseline = JSON.parse(readText(baselinePath));

function countMatches(text, patternSource) {
  const pattern = new RegExp(patternSource, 'gm');
  return [...text.matchAll(pattern)].length;
}

function tail(text, maxLines = 40) {
  const lines = text.trimEnd().split(/\r?\n/);
  return lines.slice(Math.max(0, lines.length - maxLines)).join('\n');
}

for (const [metricName, metric] of Object.entries(baseline.metrics ?? {})) {
  const command = metric.command;
  if (!Array.isArray(command) || command.length === 0) {
    fail(`quality-baseline.json: ${metricName} must define a command array`);
    continue;
  }

  if (!Number.isInteger(metric.max) || metric.max < 0) {
    fail(`quality-baseline.json: ${metricName} must define a non-negative integer max`);
    continue;
  }

  const [program, ...args] = command;
  const result = spawnSync(program, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
    maxBuffer: 64 * 1024 * 1024,
  });

  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  const count = countMatches(output, metric.count_pattern ?? '^! ');
  const exitCode = result.status ?? 1;

  if (result.error) {
    fail(`${metricName}: failed to run ${command.join(' ')}: ${result.error.message}`);
    continue;
  }

  if (exitCode !== 0 && metric.allow_nonzero_exit !== true) {
    fail(`${metricName}: ${command.join(' ')} exited ${exitCode}\n${tail(output)}`);
    continue;
  }

  if (count > metric.max) {
    fail(`${metricName}: ${count} finding(s), baseline allows ${metric.max}\n${tail(output)}`);
    continue;
  }

  const improvement = count < metric.max ? `; can lower baseline from ${metric.max}` : '';
  console.log(`✓ ${metricName}: ${count}/${metric.max}${improvement}`);
}

finish('validated advisory quality ratchet against quality-baseline.json');
