import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { repoRoot, readText } from './lib/repo.mjs';

const cliPackage = process.env.SKILLS_CLI_PACKAGE ?? 'skills@latest';
const smokeRoot = path.join(repoRoot, '.tmp', 'skills-distribution-smoke');
const projectRoot = path.join(smokeRoot, 'project');
const promptOutPath = path.join(smokeRoot, 'llm-wiki-faq.prompt.md');
const source = repoRoot;
const requiredSkill = 'llm-wiki-faq';
const requiredListItems = ['llm-wiki-faq', 'wiki-ingest', 'llm-wiki-domain-pack'];

function run(args, options = {}) {
  const command = ['npx', '--yes', cliPackage, ...args];
  console.log(`$ ${command.join(' ')}`);

  const result = spawnSync(command[0], command.slice(1), {
    cwd: options.cwd ?? repoRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      CI: '1',
      NO_COLOR: '1',
      FORCE_COLOR: '0',
    },
    maxBuffer: 20 * 1024 * 1024,
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.status !== 0) {
    throw new Error(`command failed with exit ${result.status}: ${command.join(' ')}`);
  }

  return result.stdout ?? '';
}

function findFiles(startDir, predicate) {
  if (!fs.existsSync(startDir)) return [];

  const results = [];
  const stack = [startDir];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const absPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absPath);
        continue;
      }

      if (entry.isFile() && predicate(absPath)) {
        results.push(absPath);
      }
    }
  }

  return results.sort();
}

function assertIncludes(text, needle, label) {
  if (!text.includes(needle)) {
    throw new Error(`${label} did not include expected text: ${needle}`);
  }
}

function resetSmokeRoot() {
  fs.rmSync(smokeRoot, { recursive: true, force: true });
  fs.mkdirSync(projectRoot, { recursive: true });
  fs.writeFileSync(path.join(projectRoot, 'README.md'), '# skills smoke project\n');
}

resetSmokeRoot();

console.log('## Smoke 1: list skills from local source');
const listOutput = run(['add', source, '--list']);
for (const skill of requiredListItems) {
  assertIncludes(listOutput, skill, 'skills add --list output');
}

console.log('\n## Smoke 2: render one skill prompt without starting an agent');
const promptOutput = run(['use', source, '--skill', requiredSkill]);
assertIncludes(promptOutput, 'LLM-Wiki FAQ', 'skills use output');
assertIncludes(promptOutput, 'Evidence policy', 'skills use output');
fs.writeFileSync(promptOutPath, promptOutput);
console.log(`wrote ${path.relative(repoRoot, promptOutPath)}`);

console.log('\n## Smoke 3: install one skill into a temporary project for Claude Code');
run(['add', source, '--skill', requiredSkill, '-a', 'claude-code', '--copy', '-y'], {
  cwd: projectRoot,
});

const installedSkillFiles = findFiles(projectRoot, (filePath) => path.basename(filePath) === 'SKILL.md');
const matchingSkillFiles = installedSkillFiles.filter((filePath) => {
  const text = readText(filePath);
  return text.includes(`name: ${requiredSkill}`);
});

if (matchingSkillFiles.length === 0) {
  const installed = installedSkillFiles.map((filePath) => path.relative(projectRoot, filePath)).join('\n');
  throw new Error(`installed ${requiredSkill} SKILL.md not found. Installed SKILL.md files:\n${installed || '(none)'}`);
}

console.log('installed skill files:');
for (const filePath of matchingSkillFiles) {
  console.log(`- ${path.relative(projectRoot, filePath)}`);
}

console.log('\n✓ skills distribution smoke test passed');
