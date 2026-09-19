import { HStack, Span } from '@chakra-ui/react';
import React from 'react';

import PageActions from '@/components/common/pageActions';
import ShellHeaderActions from '@/components/features/shells/shell/headerActions';
import ShellIcon from '@/components/features/shells/shellIcon';
import { getShellIcon } from '@/components/icons/shells';
import ArticleTitle from '@/components/wiki/articleTitle';
import StatArticleLink from '@/components/wiki/statArticleLink';
import { useShell } from '@/hooks/providers/shell';

export default function ShellHeader() {
  const shell = useShell();

  const shellIcon = React.useMemo(() => {
    return getShellIcon(shell.displayType);
  }, [shell.displayType]);

  return (
    <ArticleTitle
      id="shell-page-title"
      title={shell.name}
      actions={
        <PageActions>
          <ShellHeaderActions shell={shell} />
        </PageActions>
      }
      meta={
        <>
          {shell.weapon !== shell.name && (
            <Span aria-label="Weapon name">{shell.weapon}</Span>
          )}

          <HStack gap={1.5}>
            <Span>{shell.type}</Span>
            {shellIcon && <ShellIcon alt="" size={20} src={shellIcon} />}
          </HStack>

          {shell.type.toUpperCase().includes('TANDEM') && (
            <StatArticleLink article="tandem">Tandem warhead</StatArticleLink>
          )}

          {shell.eraTip && (
            <StatArticleLink article="antiEra">Anti-ERA round</StatArticleLink>
          )}
        </>
      }
    />
  );
}
