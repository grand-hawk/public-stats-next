'use client';

import { Flex, Stack } from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';
import slug from 'slug';

import Shell from '@/components/features/shells';
import ShellsSearchSidebar from '@/components/features/shells/searchSidebar';
import { getKeywords } from '@/components/layout/head';
import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';
import SearchLayout from '@/components/layout/searchLayout/layout';
import { EmptyState } from '@/components/ui/empty-state';
import InaccurateDataFooter from '@/components/wiki/inaccurateDataFooter';
import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

export default function PlaceShell() {
  const router = useRouter();
  const params = useParams();
  const shellQuery = params.shell as string;
  const shellSlug = slug(shellQuery);
  const place = usePlace()!;

  const [shell] = trpc.shells.bySlug.useSuspenseQuery({
    placeId: place.placeId,
    slug: shellSlug,
  });

  React.useEffect(() => {
    if (!shell) return;

    if (shellQuery !== shellSlug) {
      const newPath = `/${place.initials}/shells/${shellSlug}`;
      router.replace(newPath);
    }
  }, [router, shell, shellQuery, shellSlug, place.initials]);

  const title = shell ? `${shell.weapon} - ${shell.name}` : 'Shell not found';
  const description = shell
    ? `${shell.weapon} - ${shell.name} shell statistics for ${place.placeName}`
    : undefined;

  return (
    <PageMeta title={title} description={description}>
      {shell && (
        <>
          <meta
            content={[shell.weapon, shell.name, ...getKeywords(place)].join(
              ',',
            )}
            name="keywords"
          />

          {Object.entries(shell.linkedData).map(([key, linkedData]) => (
            <script
              key={key}
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(linkedData).replace(/</g, '\\u003c'),
              }}
              data-linked-data={key}
              type="application/ld+json"
            />
          ))}
        </>
      )}

      <Layout noPadding>
        <SearchLayout sidebar={<ShellsSearchSidebar />}>
          {shell ? (
            <Flex
              justifyContent="center"
              marginBottom={{
                base: 4,
                md: 0,
              }}
              padding={{
                base: 0,
                md: 2,
                lg: 4,
              }}
            >
              <Stack
                aria-labelledby="shell-page-title"
                as="article"
                gap={4}
                maxWidth={{
                  md: '4xl',
                  lg: '2xl',
                }}
                width="100%"
                data-md-target
              >
                <Shell shell={shell} />

                <InaccurateDataFooter />
              </Stack>
            </Flex>
          ) : (
            <Flex alignItems="center" height="100%">
              <EmptyState
                icon={<GrDocumentMissing />}
                title="Shell not found"
              />
            </Flex>
          )}
        </SearchLayout>
      </Layout>
    </PageMeta>
  );
}
