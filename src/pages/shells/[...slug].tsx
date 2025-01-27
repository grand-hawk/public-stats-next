import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import ShellInfo from '@/components/shells/info';
import PlaceEmptyState from '@/components/states/placeEmptyState';
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from '@/components/ui/breadcrumb';
import { useNavigationStore } from '@/stores/navigation';
import { trpc } from '@/utils/trpc';

export default function Shell() {
  const router = useRouter();
  const placeId = useNavigationStore((s) => s.placeId);
  const [weapon, shell] = router.query.slug as [string, string];

  if (placeId) trpc.shells.data.usePrefetchQuery({ placeId, weapon, shell });

  return (
    <>
      <Head>
        <title>{`${shell} - MTC Stats`}</title>
      </Head>

      <Box
        display="grid"
        gridRowGap={4}
        gridTemplateColumns="1fr"
        gridTemplateRows="max-content 1fr"
      >
        <BreadcrumbRoot>
          <NextLink href="/shells" passHref>
            <BreadcrumbLink as="span">Search</BreadcrumbLink>
          </NextLink>
          <NextLink
            href={`/shells?${new URLSearchParams({ query: weapon })}`}
            passHref
          >
            <BreadcrumbLink as="span">{weapon}</BreadcrumbLink>
          </NextLink>
          <BreadcrumbCurrentLink>{shell}</BreadcrumbCurrentLink>
        </BreadcrumbRoot>

        {placeId ? (
          <ShellInfo placeId={placeId} shell={shell} weapon={weapon} />
        ) : (
          <PlaceEmptyState />
        )}
      </Box>
    </>
  );
}
