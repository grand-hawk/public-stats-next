import Head from 'next/head';
import React from 'react';

import Search from '@/components/shells/search';

export default function WinrateTab() {
  return (
    <>
      <Head>
        <title>Shell search - MTC Stats</title>
      </Head>

      <Search />
    </>
  );
}
