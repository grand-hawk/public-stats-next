import { convert } from 'html-to-markdown-node';
import parse from 'node-html-parser';

import { formatMarkdown } from '@/server/utils/formatMarkdown';
import { setExtension } from '@/utils/extensions';

import type { HTMLElement } from 'node-html-parser';

const EXTERNAL_HREF = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const HEADING = /^(#{1,6})\s/;
const LOOSE_LIST_GAP = /^(- \*\*.*)\n(?:[ \t]*\n)+(?=- \*\*)/gm;

function rewriteLinks(target: HTMLElement) {
  for (const link of target.querySelectorAll('a')) {
    const href = link.attributes.href;
    const insideHeading = !!link.closest('h1, h2, h3, h4, h5, h6');

    if (!link.text.trim()) {
      link.remove();
      continue;
    }
    if (insideHeading || !href || href.startsWith('#')) {
      link.replaceWith(link.innerHTML);
      continue;
    }
    if (EXTERNAL_HREF.test(href)) continue;

    const [path, hash] = href.split('#');
    link.setAttribute(
      'href',
      `${setExtension(path, 'md')}${hash ? `#${hash}` : ''}`,
    );
  }
}

function flattenDefinitionLists(target: HTMLElement) {
  for (const list of target.querySelectorAll('dl')) {
    const items: string[] = [];
    let term = '';

    for (const child of list.querySelectorAll('dt, dd')) {
      if (child.tagName === 'DT') {
        term = child.text.trim();
        continue;
      }
      const value = child.innerHTML.trim();
      if (!child.text.trim()) continue;
      items.push(
        term
          ? `<li><strong>${term}:</strong> ${value}</li>`
          : `<li>${value}</li>`,
      );
      term = '';
    }

    list.replaceWith(items.length > 0 ? `<ul>${items.join('')}</ul>` : '');
  }
}

function captionFigures(target: HTMLElement) {
  for (const figure of target.querySelectorAll('figure')) {
    const caption = figure.querySelector('figcaption')?.innerHTML.trim();
    figure.replaceWith(caption ? `<p><em>Figure: ${caption}</em></p>` : '');
  }
}

function addMissingTableHeaders(target: HTMLElement) {
  for (const table of target.querySelectorAll('table')) {
    if (table.querySelector('thead')) continue;

    const firstRow = table.querySelector('tr');
    if (!firstRow) continue;

    const firstCells = firstRow.querySelectorAll('td, th');
    const isHeaderRow =
      firstCells.length > 1 &&
      firstCells.every(
        (cell) => cell.tagName === 'TH' || cell.hasAttribute('data-title'),
      );

    if (isHeaderRow) {
      firstRow.remove();
      table.insertAdjacentHTML(
        'afterbegin',
        `<thead>${firstRow.toString()}</thead>`,
      );
      continue;
    }

    const columns = firstCells.length;
    const cells = Array.from({ length: columns }, (_, index) =>
      index === 0 ? '<th>Stat</th>' : '<th>Value</th>',
    );
    table.insertAdjacentHTML(
      'afterbegin',
      `<thead><tr>${cells.join('')}</tr></thead>`,
    );
  }
}

function dropEmptySections(markdown: string) {
  const lines = markdown.split('\n');
  const kept: string[] = [];

  for (let index = 0; index < lines.length; index++) {
    const level = HEADING.exec(lines[index])?.[1].length;
    if (!level) {
      kept.push(lines[index]);
      continue;
    }

    let next = index + 1;
    while (next < lines.length && !lines[next].trim()) next++;

    const nextLevel =
      next < lines.length ? HEADING.exec(lines[next])?.[1].length : 0;
    const isEmpty = nextLevel !== undefined && nextLevel <= level;
    if (!isEmpty) kept.push(lines[index]);
  }

  return kept.join('\n');
}

export async function processHtmlToMarkdown(html: string) {
  const root = parse(html);
  const target = root.querySelector('[data-md-target]');
  if (!target) return null;

  for (const node of target.querySelectorAll('[data-md-ignore]')) node.remove();
  for (const node of target.querySelectorAll('[data-md-show]')) {
    node.removeAttribute('style');
    node.removeAttribute('display');
    node.removeAttribute('hidden');
  }

  captionFigures(target);

  for (const style of target.querySelectorAll('style')) style.remove();
  for (const img of target.querySelectorAll('img, svg')) img.remove();
  for (const br of target.querySelectorAll('br')) br.replaceWith(' ');
  for (const sup of target.querySelectorAll('sup')) {
    sup.replaceWith(`^${sup.text}`);
  }
  for (const term of target.querySelectorAll('dt')) {
    term.removeAttribute('style');
  }
  for (const header of target.querySelectorAll('header')) {
    header.tagName = 'div';
  }

  rewriteLinks(target);
  flattenDefinitionLists(target);
  addMissingTableHeaders(target);

  let markdown = convert(
    target.children.map((child) => child.toString()).join(''),
    {
      brInTables: false,
      encoding: 'utf-8',
      preprocessing: {
        enabled: true,
      },
    },
  );

  markdown = markdown.replace(/<br\s*\/?>/gi, ' ');
  markdown = markdown.replace(LOOSE_LIST_GAP, '$1\n');
  markdown = dropEmptySections(markdown);

  return formatMarkdown(markdown);
}
