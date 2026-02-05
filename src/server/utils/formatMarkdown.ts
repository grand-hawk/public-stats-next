import prettier from 'prettier';

import { getBaseUrl } from '@/utils/trpc';

export function escapeMarkdownLink(link: string) {
  return link.replace(/[[\]()]/g, '\\$&');
}

export async function formatMarkdown(markdown: string) {
  markdown = `
> [!NOTE]  
> Remove \`/md/\` and \`.md\` from the URL to link to the regular page.
> Base URL: \`${getBaseUrl()}\`

${markdown}
`;

  return prettier.format(markdown, { parser: 'markdown' });
}
