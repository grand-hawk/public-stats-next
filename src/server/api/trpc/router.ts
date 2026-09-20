import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';

import { createTRPCRouter } from '@/server/api/trpc/context';
import { articlesRouter } from '@/server/api/trpc/routers/articles';
import { configRouter } from '@/server/api/trpc/routers/config';
import { homeRouter } from '@/server/api/trpc/routers/home';
import { infantryWeaponsRouter } from '@/server/api/trpc/routers/infantryWeapons';
import { kdrRouter } from '@/server/api/trpc/routers/kdr';
import { loadoutsRouter } from '@/server/api/trpc/routers/loadouts';
import { searchRouter } from '@/server/api/trpc/routers/search';
import { shellsRouter } from '@/server/api/trpc/routers/shells';
import { teamsRouter } from '@/server/api/trpc/routers/teams';
import { updatesRouter } from '@/server/api/trpc/routers/updates';
import { vehiclesRouter } from '@/server/api/trpc/routers/vehicles';
import { winrateRouter } from '@/server/api/trpc/routers/winrate';

export const appRouter = createTRPCRouter({
  articles: articlesRouter,
  config: configRouter,
  home: homeRouter,
  infantryWeapons: infantryWeaponsRouter,
  kdr: kdrRouter,
  loadouts: loadoutsRouter,
  search: searchRouter,
  shells: shellsRouter,
  teams: teamsRouter,
  updates: updatesRouter,
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
