'use client';

import { useSearchParams } from 'next/navigation';

export function useDebugEnabled() {
  const searchParams = useSearchParams();
  const debugQuery = searchParams.get('debug');

  return !!debugQuery || process.env.NODE_ENV === 'development';
}
