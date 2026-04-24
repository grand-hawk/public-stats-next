import { Box, Flex, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';
import Markdown from 'react-markdown';
import slugify from 'slug';

import ArticleToc from '@/components/common/articleToc';
import RelatedPages from '@/components/common/relatedPages';
import LoadoutHeader from '@/components/features/loadouts/header';
import LoadoutTeams from '@/components/features/loadouts/teams';
import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';
import { EmptyState } from '@/components/ui/empty-state';
import { Prose } from '@/components/ui/prose';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { articleMarkdownComponents } from '@/utils/articleMarkdown';
import { loadoutDisplayName } from '@/utils/loadoutDisplayName';
import { trpc } from '@/utils/trpc';
import { applyWikilinks } from '@/utils/wikilinks';

export default function PlaceLoadout() {
  const router = useRouter();
  const loadoutQuery = useRouterQuery('loadout')!;
  const loadoutSlug = slugify(loadoutQuery);
  const place = usePlace()!;

  const articleRef = React.useRef<HTMLDivElement>(null);

  const [loadout] = trpc.loadouts.bySlug.useSuspenseQuery({
    placeId: place.placeId,
    slug: loadoutSlug,
  });

  const linkedDescription = loadout?.description
    ? applyWikilinks(loadout.description, place.initials)
    : undefined;

  React.useEffect(() => {
    if (!loadout) return;

    if (loadoutQuery !== loadoutSlug) {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          loadout: loadoutSlug,
        },
      });
    }
  }, [router, loadoutQuery, loadout, loadoutSlug]);

  const displayName = loadout ? loadoutDisplayName(loadout.name) : null;
  const title = displayName ?? 'Loadout not found';
  const description = displayName
    ? `${displayName} loadout statistics and team compositions for ${place.placeName}`
    : undefined;

  return (
    <PageMeta title={title} description={description}>
      <Layout noPadding overwriteTabLabel={displayName ?? undefined}>
        {loadout ? (
          <Flex
            justifyContent="center"
            marginBottom={{ base: 4, md: 0 }}
            paddingX={{ base: 4, md: 6, lg: 8 }}
            paddingY={{ base: 0, md: 2, lg: 4 }}
          >
            <Box
              display="flex"
              gap={4}
              maxWidth={{
                base: '4xl',
                '2xl':
                  'calc(var(--chakra-sizes-4xl) + var(--chakra-sizes-3xs) + var(--chakra-spacing-4))',
              }}
              width="100%"
            >
              <Stack
                aria-labelledby="loadout-page-title"
                as="article"
                data-md-target
                flex="1"
                gap={4}
                maxWidth="4xl"
                minWidth={0}
                ref={articleRef}
              >
                <LoadoutHeader name={loadout.name} slug={loadoutSlug} />

                {linkedDescription && (
                  <Prose color="fg/90" maxWidth="none" size="md">
                    <Markdown components={articleMarkdownComponents}>
                      {linkedDescription}
                    </Markdown>
                  </Prose>
                )}

                <LoadoutTeams initials={place.initials} loadout={loadout} />

                <RelatedPages items={loadout.relatedPages} />
              </Stack>

              <Box
                as="aside"
                data-md-ignore
                flexShrink={0}
                hideBelow="2xl"
                maxHeight="max-content"
                position="sticky"
                top={4}
                width="var(--chakra-sizes-3xs)"
              >
                <ArticleToc articleRef={articleRef} />
              </Box>
            </Box>
          </Flex>
        ) : (
          <Flex alignItems="center" height="100%">
            <EmptyState
              icon={<GrDocumentMissing />}
              title="Loadout not found"
            />
          </Flex>
        )}
      </Layout>
    </PageMeta>
  );
}
