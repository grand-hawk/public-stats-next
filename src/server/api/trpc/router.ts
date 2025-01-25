import { createTRPCRouter } from './context';
import { configRouter } from '@/server/api/trpc/routers/config';
import { kdrRouter } from '@/server/api/trpc/routers/kdr';

export const appRouter = createTRPCRouter({
  config: configRouter,
  kdr: kdrRouter,
});

export type AppRouter = typeof appRouter;
