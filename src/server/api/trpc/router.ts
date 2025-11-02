import { createTRPCRouter } from './context';
import { configRouter } from '@/server/api/trpc/routers/config';
import { kdrRouter } from '@/server/api/trpc/routers/kdr';
import { shellsRouter } from '@/server/api/trpc/routers/shells';
import { vehiclesRouter } from '@/server/api/trpc/routers/vehicles';
import { winrateRouter } from '@/server/api/trpc/routers/winrate';

export const appRouter = createTRPCRouter({
  config: configRouter,
  kdr: kdrRouter,
  shells: shellsRouter,
  vehicles: vehiclesRouter,
  winrate: winrateRouter,
});

export type AppRouter = typeof appRouter;
