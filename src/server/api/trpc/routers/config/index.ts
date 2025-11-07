import { publicProcedure } from '@/server/api/trpc/context';
import { getConfig } from '@generated/config';

export const configRouter = publicProcedure.query(() => {
  return getConfig();
});
