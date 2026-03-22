import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const publicSkillsDir = path.join(rootDir, 'skills');
const internalSkillsDir = path.join(rootDir, '.agents', 'skills');

async function listSkillFiles(baseDir) {
  const entries = await readdir(baseDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillFile = path.join(baseDir, entry.name, 'SKILL.md');
    try {
      await readFile(skillFile, 'utf8');
      files.push(skillFile);
    } catch {
      // ignore directories without SKILL.md
    }
  }

  return files.sort();
}

function extractFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error('missing YAML frontmatter');
  }
  return match[1];
}

function getScalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim() : null;
}

function hasUnsafePlainDescription(frontmatter) {
  const match = frontmatter.match(/^description:\s*(.+)$/m);
  if (!match) return false;

  const value = match[1].trim();
  if (value === '>' || value === '|' || value.startsWith('"') || value.startsWith("'")) {
    return false;
  }

  return value.includes(': ');
}

function hasInternalMetadata(frontmatter) {
  return /metadata:\s*\n(?:\s+.+\n)*\s*internal:\s*true\b/m.test(frontmatter);
}

async function main() {
  const errors = [];
  const publicSkillFiles = await listSkillFiles(publicSkillsDir);
  const internalSkillFiles = await listSkillFiles(internalSkillsDir);
  const seenNames = new Set();

  for (const file of publicSkillFiles) {
    const source = await readFile(file, 'utf8');
    const frontmatter = extractFrontmatter(source);
    const name = getScalar(frontmatter, 'name');
    const description = getScalar(frontmatter, 'description');

    if (!name) {
      errors.push(`${path.relative(rootDir, file)}: missing name`);
      continue;
    }

    if (!description) {
      errors.push(`${path.relative(rootDir, file)}: missing description`);
    }

    if (hasUnsafePlainDescription(frontmatter)) {
      errors.push(`${path.relative(rootDir, file)}: description should be quoted or folded because it contains ": "`);
    }

    if (seenNames.has(name)) {
      errors.push(`${path.relative(rootDir, file)}: duplicate public skill name "${name}"`);
    }

    seenNames.add(name);
  }

  for (const file of internalSkillFiles) {
    const source = await readFile(file, 'utf8');
    const frontmatter = extractFrontmatter(source);

    if (!hasInternalMetadata(frontmatter)) {
      errors.push(`${path.relative(rootDir, file)}: expected metadata.internal: true`);
    }
  }

  if (errors.length > 0) {
    console.error('Skill pack verification failed:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Verified ${publicSkillFiles.length} public skills and ${internalSkillFiles.length} internal helper skills.`);
}

await main();
