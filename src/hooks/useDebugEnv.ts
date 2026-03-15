import { IS_DEV } from '@/env';
import { useRouterQuery } from '@/hooks/useRouterQuery';

export function useDebugEnabled() {
  const debugQuery = useRouterQuery('debug');

  return !!debugQuery || IS_DEV;
}
