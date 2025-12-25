import { useRouterQuery } from '@/hooks/useRouterQuery';

export function useDebugEnabled() {
  const debugQuery = useRouterQuery('debug');

  return !!debugQuery || process.env.NODE_ENV === 'development';
}
