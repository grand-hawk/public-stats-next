import React from 'react';

import type { DetailedShell } from '@/server/api/trpc/routers/shells';

export type ShellContext = DetailedShell;

export const ShellContext = React.createContext<ShellContext>(
  {} as ShellContext,
);

export function useShell() {
  return React.useContext(ShellContext);
}
