import { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

import { roboto, robotoMono } from '@/components/providers/chakra/system';

export default function Document() {
  return (
    <Html
      className={`${roboto.className} ${roboto.variable} ${robotoMono.variable}`}
      data-scroll-behavior="smooth"
      lang="en"
    >
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
