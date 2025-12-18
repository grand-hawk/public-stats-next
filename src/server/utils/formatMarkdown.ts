import prettier from 'prettier';

export function escapeMarkdownLink(link: string) {
  return link.replace(/[[\]()]/g, '\\$&');
}

export async function formatMarkdown(markdown: string) {
  markdown = `
> [!NOTE]  
> Remove \`/md/\` and \`.md\` from the URL to link to the regular page.

${markdown}
`;

  return prettier.format(markdown, { parser: 'markdown' });
}
