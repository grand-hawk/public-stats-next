'use client';

import { Box } from '@chakra-ui/react';
import React, { Suspense } from 'react';

import { CenterSpinner } from '@/components/common/spinners';
import DevelopmentOverlay from '@/components/development/overlay';
import InternalHead from '@/components/layout/head';
import { ChakraProvider } from '@/components/providers/chakra';
import DebugGate from '@/components/providers/debugGate';
import { NuqsProvider } from '@/components/providers/nuqs';
import { TRPCProvider } from '@/components/providers/trpc';
import Umami from '@/components/providers/umami';
import { Toaster } from '@/components/ui/toaster';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <Suspense>
        <InternalHead />
      </Suspense>

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

        <Suspense>
          <DebugGate>
            <DevelopmentOverlay />
          </DebugGate>
        </Suspense>
      </ChakraProvider>

      <Umami />
    </TRPCProvider>
  );
}
