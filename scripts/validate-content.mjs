import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { createConsola } from 'consola';
import { parse } from 'yaml';

const CONTENT_DIR = 'content/vehicles';
const CONFIG_PATH = 'content/config.yml';

const consola = createConsola({ formatOptions: { date: false } });

const config = parse(await readFile(CONFIG_PATH, 'utf-8'));
const sections = config.vehicles.sections;
const allowedNames = sections.map((s) => s.name);
const rulesByName = Object.fromEntries(
  sections
    .filter((s) => s.lineRule)
    .map((s) => [s.name, new RegExp(s.lineRule)]),
);

let files = process.argv.slice(2);
if (files.length === 0) {
  const entries = await readdir(CONTENT_DIR);
  files = entries
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(CONTENT_DIR, f));
}

if (files.length === 0) {
  consola.info('No files to validate');
  process.exit(0);
}

consola.start(`Validating ${files.length} content files...`);

let hasErrors = false;

for (const filepath of files) {
  const errors = [];
  let content;

  try {
    content = await readFile(filepath, 'utf-8');
  } catch {
    errors.push('File not found or unreadable');
    report(filepath, errors);
    continue;
  }

  const lines = content.split('\n');

  // check for consecutive blank lines
  for (let i = 0; i < lines.length - 1; i += 1) {
    if (lines[i].trim() === '' && lines[i + 1].trim() === '')
      errors.push(`Line ${i + 2}: consecutive blank lines are not allowed`);
  }

  // must start with an h1
  if (!lines[0]?.startsWith('# ') || lines[0].startsWith('## '))
    errors.push('File must start with a single # heading (vehicle name)');

  const headings = lines
    .map((line, i) => ({ line, num: i + 1 }))
    .filter(({ line }) => /^#{1,6} /.test(line));

  // only one h1 allowed
  const h1s = headings.filter(({ line }) => /^# [^#]/.test(line));
  if (h1s.length > 1)
    errors.push(
      `Only one # heading allowed, found ${h1s.length} (lines ${h1s.map((h) => h.num).join(', ')})`,
    );

  // check ## sections (the only restricted heading level)
  const h2s = headings.filter(({ line }) => /^## [^#]/.test(line));
  const seenSections = new Map();
  for (const { line, num } of h2s) {
    const sectionName = line.replace(/^## /, '').trim();
    if (!allowedNames.includes(sectionName))
      errors.push(
        `Line ${num}: unknown section "## ${sectionName}" (allowed: ${allowedNames.join(', ')})`,
      );
    if (seenSections.has(sectionName))
      errors.push(
        `Line ${num}: duplicate section "## ${sectionName}" (first at line ${seenSections.get(sectionName)})`,
      );
    else seenSections.set(sectionName, num);
  }

  // check all required sections are present
  for (const name of allowedNames) {
    if (!seenSections.has(name))
      errors.push(`Missing required section "## ${name}"`);
  }

  // validate line rules and collect Description content
  let currentSection = null;
  const sectionContent = new Map();
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const h2Match = line.match(/^## ([^#].*)$/);

    if (h2Match) {
      currentSection = h2Match[1].trim();
      continue;
    }

    // skip headings and blank lines
    if (/^#{1,6} /.test(line) || line.trim() === '') continue;

    // content outside of any ## section
    if (!currentSection) {
      errors.push(
        `Line ${i + 1}: content outside of a section — should be under a ## heading`,
      );
      continue;
    }

    const rule = rulesByName[currentSection];
    if (rule && !rule.test(line.trim()))
      errors.push(
        `Line ${i + 1}: content in "${currentSection}" doesn't match required format — got "${line.trim()}"`,
      );

    // range: left must be strictly less than right
    if (rule && rule.test(line.trim())) {
      const rangeMatch = line.trim().match(/:\s*(~?\d+)-(~?\d+)$/);
      if (rangeMatch) {
        const left = parseInt(rangeMatch[1].replace('~', ''), 10);
        const right = parseInt(rangeMatch[2].replace('~', ''), 10);
        if (left >= right)
          errors.push(
            `Line ${i + 1}: armor range must have left < right, got ${rangeMatch[1]}-${rangeMatch[2]}`,
          );
      }
    }

    if (!sectionContent.has(currentSection))
      sectionContent.set(currentSection, []);
    sectionContent.get(currentSection).push(line.trim());
  }

  const vehicleName = lines[0]?.replace(/^# /, '').trim() ?? '';
  const descriptionText = sectionContent.get('Description')?.join(' ') ?? '';
  if (
    vehicleName &&
    descriptionText.trim() &&
    !descriptionText.toLowerCase().includes(vehicleName.toLowerCase())
  ) {
    errors.push(
      `Description must mention the vehicle name "${vehicleName}" when not empty`,
    );
  }

  report(filepath, errors);
}

function report(filepath, errors) {
  if (errors.length === 0) return;
  hasErrors = true;
  consola.error(
    `${filepath}:\n${errors.map((error) => `  - ${error}`).join('\n')}`,
  );
}

if (hasErrors) {
  consola.fail('Content validation failed');
  process.exit(1);
} else consola.success(`Validated ${files.length} files`);
