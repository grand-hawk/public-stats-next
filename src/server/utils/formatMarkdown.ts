import prettier from 'prettier';

export function escapeMarkdownLink(link: string) {
  return link.replace(/[[\]()]/g, '\\$&');
}

export async function formatMarkdown(markdown: string) {
  return prettier.format(markdown, { parser: 'markdown' });
}
