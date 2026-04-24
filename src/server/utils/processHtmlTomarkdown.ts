import { convert } from 'html-to-markdown-node';
import parse from 'node-html-parser';

import { formatMarkdown } from '@/server/utils/formatMarkdown';
import { setExtension } from '@/utils/extensions';

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

  for (const style of target.querySelectorAll('style')) style.remove();
  for (const img of target.querySelectorAll('img, svg')) img.remove();
  for (const br of target.querySelectorAll('br')) br.replaceWith(' ');
  for (const link of target.querySelectorAll('a')) {
    const href = link.attributes.href;
    if (!href || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) continue;
    link.setAttribute('href', setExtension(`/md${href}`, 'md'));
  }

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
  const formattedMarkdown = await formatMarkdown(markdown);

  return formattedMarkdown;
}
