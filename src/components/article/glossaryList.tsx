import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { ARTICLE_BLOCK_GAP } from '@/components/article/prose';
import { NARROW_MEDIA } from '@/components/layout/shell/constants';
import { RAISED_FRAME_CSS } from '@/components/ui/styles';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { trpc } from '@/utils/trpc';

export default function GlossaryList({ section }: { section: string }) {
  const initials = usePlaceInitials();
  const router = useRouter();
  const [activeAnchor, setActiveAnchor] = React.useState('');
  const [terms] = trpc.articles.glossary.useSuspenseQuery();

  React.useEffect(() => {
    const readHash = () =>
      setActiveAnchor(decodeURIComponent(window.location.hash.slice(1)));

    readHash();
    window.addEventListener('hashchange', readHash);
    router.events.on('hashChangeComplete', readHash);
    router.events.on('routeChangeComplete', readHash);
    return () => {
      window.removeEventListener('hashchange', readHash);
      router.events.off('hashChangeComplete', readHash);
      router.events.off('routeChangeComplete', readHash);
    };
  }, [router.events]);
  const sectionTerms = terms
    .filter((term) => term.section === section)
    .sort((a, b) => a.label.localeCompare(b.label));
  if (sectionTerms.length === 0) return null;

  return (
    <Box
      as="dl"
      css={{
        ...RAISED_FRAME_CSS,
        marginBlock: ARTICLE_BLOCK_GAP,
        overflow: 'hidden',
      }}
    >
      {sectionTerms.map((term) => (
        <Box
          data-active={activeAnchor === term.anchor || undefined}
          id={term.anchor}
          key={term.id}
          css={{
            display: 'grid',
            gap: '4px 24px',
            gridTemplateColumns: '200px minmax(0, 1fr)',
            padding: '12px 16px',
            scrollMarginTop: '64px',
            '&:not(:first-of-type)': {
              borderBlockStartWidth: '1px',
              borderBlockStartStyle: 'solid',
              borderColor: 'var(--border-color-subtle)',
            },
            '&[data-active]': { backgroundColor: 'var(--color-surface-2)' },
            [NARROW_MEDIA]: { gridTemplateColumns: 'minmax(0, 1fr)' },
          }}
        >
          <Box as="dt" color="fg.emphasized" fontWeight={600}>
            {term.label}
          </Box>
          <Box
            as="dd"
            color="fg"
            css={{ margin: 0, fontSize: '0.9375rem', lineHeight: '1.5rem' }}
          >
            {term.definition}
            {term.article && (
              <>
                {' '}
                <NextLink href={`/${initials}/${term.article}`} prefetch={false}>
                  Read more
                </NextLink>
              </>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
