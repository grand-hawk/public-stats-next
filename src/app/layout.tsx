import { GeistMono } from 'geist/font/mono';
import React, { Suspense } from 'react';

import { Box } from '@chakra-ui/react';

import { CenterSpinner } from '@/components/common/spinners';
import DevelopmentOverlay from '@/components/development/overlay';
import InternalHead from '@/components/layout/head';
import { ChakraProvider } from '@/components/providers/chakra';
import { TRPCProvider } from '@/components/providers/trpc';
import Umami from '@/components/providers/umami';
import { Toaster } from '@/components/ui/toaster';
import DebugGate from '@/components/providers/debugGate';
import { NuqsProvider } from '@/components/providers/nuqs';

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
        <TRPCProvider>
          <InternalHead />

          <ChakraProvider>
            <NuqsProvider>
              <Suspense
                fallback={
                  <Box height="100svh">
                    <CenterSpinner />
                  </Box>
                }
              >
                {children}
              </Suspense>
            </NuqsProvider>

            <Toaster />

            <DebugGate>
              <DevelopmentOverlay />
            </DebugGate>
          </ChakraProvider>

          <Umami />
        </TRPCProvider>
      </body>
    </html>
  );
}
