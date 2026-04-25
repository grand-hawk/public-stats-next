import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

export default function Document() {
  return (
    <Html
      className={`${GeistMono.className} ${GeistSans.variable}`}
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
