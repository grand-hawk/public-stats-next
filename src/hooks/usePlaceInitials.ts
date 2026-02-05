import { useRouterQuery } from '@/hooks/useRouterQuery';

export function usePlaceInitials() {
  return useRouterQuery('place') ?? 'mtc';
}
