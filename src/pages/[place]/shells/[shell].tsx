import { Flex, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';
import slug from 'slug';

import SearchLayout from '@/components/searchLayout/layout';
import ShellsSearchSidebar from '@/components/shells/searchSidebar';
import ShellDamage from '@/components/shells/shell/damage';
import ShellHeader from '@/components/shells/shell/header';
import ShellMissile from '@/components/shells/shell/missile';
import ShellPenetrationTable from '@/components/shells/shell/penetrationTable';
import ShellProjectile from '@/components/shells/shell/projectile';
import ShellVehicles from '@/components/shells/shell/vehicles';
import { EmptyState } from '@/components/ui/empty-state';
import { getKeywords } from '@/components/utils/head';
import Layout from '@/components/utils/layout';
import InaccurateDataFooter from '@/components/wikiComponents/inaccurateDataFooter';
import { ShellContext } from '@/hooks/providers/shell';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { formatTitle } from '@/utils/formatTitle';
import { trpc } from '@/utils/trpc';

export default function PlaceShell() {
  const router = useRouter();
  const shellQuery = useRouterQuery('shell')!;
  const shellSlug = slug(shellQuery);
  const place = usePlace()!;

  const [shell] = trpc.shells.bySlug.useSuspenseQuery({
    placeId: place.placeId,
    slug: shellSlug,
  });

  React.useEffect(() => {
    if (!shell) return;

    if (shell.slug !== shellQuery)
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          vehicle: shell.slug,
        },
      });
  }, [router, shellQuery, shell]);

  const title = shell ? `${shell.weapon} - ${shell.name}` : null;

  return (
    <>
      {shell && title ? (
        <Head>
          <title>{formatTitle(title, place.initials)}</title>

          <meta content={title} property="og:title" />
          <meta content={title} name="twitter:title" />
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
        </Head>
      ) : (
        <Head>
          <title>{formatTitle('Shell not found', place.initials)}</title>
        </Head>
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
              >
                <ShellContext.Provider value={shell}>
                  <ShellHeader />
                  <ShellProjectile />
                  <ShellDamage />
                  <ShellMissile />
                  <ShellPenetrationTable />
                  <ShellVehicles />
                </ShellContext.Provider>

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
    </>
  );
}
