import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { repoRoot, readText } from './lib/repo.mjs';
import { validateSkillSelfContainment } from './lib/skill-self-containment.mjs';

const cliPackage = process.env.SKILLS_CLI_PACKAGE ?? 'skills@1.5.15';
const smokeRoot = path.join(repoRoot, '.tmp', 'skills-distribution-smoke');
const projectRoot = path.join(smokeRoot, 'project');
const promptOutPath = path.join(smokeRoot, 'llm-wiki-faq.prompt.md');
const source = repoRoot;
const requiredSkill = 'llm-wiki-faq';
const requiredListItems = ['llm-wiki-faq', 'wiki-ingest', 'llm-wiki-domain-pack'];
const allSkillNames = fs
  .readdirSync(path.join(repoRoot, 'skills'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(repoRoot, 'skills', entry.name, 'SKILL.md')))
  .map((entry) => entry.name)
  .sort();

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

function parseSkillName(text) {
  const match = text.match(/^name:\s*([a-z0-9-]+)\s*$/m);
  return match?.[1] ?? null;
}

function findInstalledSkillRoot(skillName) {
  const matches = findFiles(projectRoot, (filePath) => path.basename(filePath) === 'SKILL.md').filter((filePath) => {
    return parseSkillName(readText(filePath)) === skillName;
  });

  if (matches.length !== 1) {
    const installed = findFiles(projectRoot, (filePath) => path.basename(filePath) === 'SKILL.md')
      .map((filePath) => path.relative(projectRoot, filePath))
      .join('\n');
    throw new Error(`expected exactly one installed ${skillName} SKILL.md, found ${matches.length}. Installed SKILL.md files:\n${installed || '(none)'}`);
  }

  return path.dirname(matches[0]);
}

function assertStandaloneSkill(skillRoot, skillName) {
  const errors = validateSkillSelfContainment(skillRoot);
  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
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

console.log('\n## Smoke 3: install every skill into a temporary project for Claude Code');
for (const skillName of allSkillNames) {
  run(['add', source, '--skill', skillName, '-a', 'claude-code', '--copy', '-y'], {
    cwd: projectRoot,
  });

  const skillRoot = findInstalledSkillRoot(skillName);
  assertStandaloneSkill(skillRoot, skillName);
  console.log(`installed standalone skill: ${skillName} -> ${path.relative(projectRoot, skillRoot)}`);
}

console.log('\n✓ skills distribution smoke test passed');
