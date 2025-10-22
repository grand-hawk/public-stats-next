import { createTRPCRouter } from './context';
import { configRouter } from '@/server/api/trpc/routers/config';
import { shellsRouter } from '@/server/api/trpc/routers/shells';
import { vehiclesRouter } from '@/server/api/trpc/routers/vehicles';

export const appRouter = createTRPCRouter({
  config: configRouter,
  shells: shellsRouter,
  vehicles: vehiclesRouter,
});

export type AppRouter = typeof appRouter;
