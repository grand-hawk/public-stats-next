import { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <script
        async
        src="https://unpkg.com/react-scan/dist/auto.global.js"
      ></script>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
