import Head from 'next/head';
import React from 'react';

import Search from '@/components/vehicles/search';

import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';

export const getServerSideProps = (async ({ query: queryParams }) => {
  return {
    props: {
      initialQuery:
        typeof queryParams.query === 'string' ? queryParams.query : null,
    },
  };
}) satisfies GetServerSideProps<{ initialQuery: string | null }>;

export default function VehicleSearch({
  initialQuery,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Vehicle search - MTC Stats</title>
      </Head>

      <Search initialQuery={initialQuery} />
    </>
  );
}
