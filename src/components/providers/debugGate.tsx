'use client';

import React from 'react';

import { useDebugEnabled } from '@/hooks/useDebugEnv';

export default function DebugGate({ children }: { children: React.ReactNode }) {
  const debugEnabled = useDebugEnabled();
  if (!debugEnabled) return null;
  return <>{children}</>;
}
