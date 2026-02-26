import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';

import { createTRPCRouter } from '@/server/api/trpc/context';
import { configRouter } from '@/server/api/trpc/routers/config';
import { kdrRouter } from '@/server/api/trpc/routers/kdr';
import { loadoutsRouter } from '@/server/api/trpc/routers/loadouts';
import { shellsRouter } from '@/server/api/trpc/routers/shells';
import { teamsRouter } from '@/server/api/trpc/routers/teams';
import { vehiclesRouter } from '@/server/api/trpc/routers/vehicles';
import { winrateRouter } from '@/server/api/trpc/routers/winrate';


export const appRouter = createTRPCRouter({
  config: configRouter,
  kdr: kdrRouter,
  loadouts: loadoutsRouter,
  shells: shellsRouter,
  teams: teamsRouter,
  vehicles: vehiclesRouter,
  winrate: winrateRouter,
});

export const createHelpers = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: {},
    transformer: superjson,
  });

export type AppRouter = typeof appRouter;
