import { createTRPCRouter } from './context';
import { kdrRouter } from '@/server/api/trpc/routers/kdr';

export const appRouter = createTRPCRouter({
  kdr: kdrRouter,
});

export type AppRouter = typeof appRouter;
