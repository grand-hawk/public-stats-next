import { createTRPCRouter } from './context';
import { configRouter } from '@/server/api/trpc/routers/config';
import { kdrRouter } from '@/server/api/trpc/routers/kdr';
import { winrateRouter } from '@/server/api/trpc/routers/winrate';

export const appRouter = createTRPCRouter({
  config: configRouter,
  kdr: kdrRouter,
  winrate: winrateRouter,
});

export type AppRouter = typeof appRouter;
