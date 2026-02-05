import Script from 'next/script';
import React from 'react';

import { env } from '@/env';

export default function Umami() {
  const { NEXT_PUBLIC_ANALYTICS_DOMAIN: domain, NEXT_PUBLIC_ANALYTICS_ID: id } =
    env;

  return (
    domain &&
    id && (
      <Script
        data-website-id={id}
        defer
        src={new URL('/script.js', domain).toString()}
      />
    )
  );
}
