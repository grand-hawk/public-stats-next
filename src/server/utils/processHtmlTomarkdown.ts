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
  for (const link of target.querySelectorAll('a'))
    link.setAttribute('href', setExtension(`/md${link.attributes.href}`, 'md'));

  const markdown = convert(
    target.children.map((child) => child.toString()).join(''),
    {
      encoding: 'utf-8',
      preprocessing: {
        enabled: true,
      },
    },
  );

  const formattedMarkdown = await formatMarkdown(markdown);

  return formattedMarkdown;
}
