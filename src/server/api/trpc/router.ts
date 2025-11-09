import { configRouter } from '@/server/api/trpc/routers/config';
import { kdrRouter } from '@/server/api/trpc/routers/kdr';
import { shellsRouter } from '@/server/api/trpc/routers/shells';
import { teamsRouter } from '@/server/api/trpc/routers/teams';
import { updateRouter } from '@/server/api/trpc/routers/update';
import { vehiclesRouter } from '@/server/api/trpc/routers/vehicles';
import { winrateRouter } from '@/server/api/trpc/routers/winrate';

import { createTRPCRouter } from './context';

export const appRouter = createTRPCRouter({
  config: configRouter,
  kdr: kdrRouter,
  shells: shellsRouter,
  teams: teamsRouter,
  update: updateRouter,
  vehicles: vehiclesRouter,
  winrate: winrateRouter,
});

export type AppRouter = typeof appRouter;
