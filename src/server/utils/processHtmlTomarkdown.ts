import { convert } from 'html-to-markdown-node';
import parse from 'node-html-parser';

import { formatMarkdown } from '@/server/utils/formatMarkdown';

export async function processHtmlToMarkdown(html: string) {
  const root = parse(html);
  const target = root.querySelector('[data-md-target]');
  if (!target) return null;

  for (const node of target.querySelectorAll('[data-md-ignore]')) node.remove();

  for (const img of target.querySelectorAll('img, svg')) img.remove();

  const markdown = await formatMarkdown(
    convert(target.children.map((child) => child.toString()).join('\n'), {
      encoding: 'utf-8',
      preprocessing: {
        enabled: true,
        removeNavigation: true,
        removeForms: true,
      },
    }),
  );

  return markdown;
}
