import { publicProcedure } from '@/server/api/trpc/context';
import config from '@generated/config';

export const configRouter = publicProcedure.query(() => {
  return config;
});
