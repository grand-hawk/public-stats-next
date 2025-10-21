import { createTRPCRouter } from './context';
import { configRouter } from '@/server/api/trpc/routers/config';
import { vehiclesRouter } from '@/server/api/trpc/routers/vehicles';

export const appRouter = createTRPCRouter({
  config: configRouter,
  vehicles: vehiclesRouter,
});

export type AppRouter = typeof appRouter;
