import { createTRPCRouter } from './context';
import { configRouter } from '@/server/api/trpc/routers/config';
import { loadoutsRouter } from '@/server/api/trpc/routers/loadouts';
import { vehiclesRouter } from '@/server/api/trpc/routers/vehicles';

export const appRouter = createTRPCRouter({
  config: configRouter,
  loadouts: loadoutsRouter,
  vehicles: vehiclesRouter,
});

export type AppRouter = typeof appRouter;
