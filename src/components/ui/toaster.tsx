'use client';

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from '@chakra-ui/react';
import React from 'react';

import { MOBILE_MEDIA, RAIL_WIDTH } from '@/components/layout/shell/constants';

export const toaster = createToaster({
  placement: 'bottom-end',
  offsets: {
    top: '1rem',
    right: '1rem',
    bottom: 'var(--toast-offset-bottom, 1rem)',
    left: '1rem',
  },
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster
        css={{
          [MOBILE_MEDIA]: {
            '--toast-offset-bottom': `calc(${RAIL_WIDTH} + 12px)`,
          },
        }}
        insetInline={{ mdDown: '4' }}
        toaster={toaster}
      >
        {(toast) => (
          <Toast.Root width="auto">
            {toast.type === 'loading' && (
              <Spinner color="blue.solid" size="sm" />
            )}
            <Stack flex="1" gap="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.meta?.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
