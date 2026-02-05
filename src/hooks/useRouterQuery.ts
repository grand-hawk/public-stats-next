import { useRouter } from 'next/router';

export function useRouterQuery(key: string): string | null {
  const router = useRouter();

  const value = router.query[key];
  if (!value || typeof value !== 'string') return null;

  return value;
}
