import { useParams } from 'next/navigation';

export function useRouterQuery(key: string): string | null {
  const params = useParams();

  const value = params?.[key];
  if (!value || typeof value !== 'string') return null;

  return value;
}
