import { trpc } from '@/utils/trpc';

export function useSuspenseConfig() {
  const [config] = trpc.config.useSuspenseQuery();
  return config.data;
}
