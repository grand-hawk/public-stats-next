import { GeistMono } from 'geist/font/mono';
import React from 'react';

import Providers from '@/components/providers';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={GeistMono.className}
      data-scroll-behavior="smooth"
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
