import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';

import { appRouter } from '@/server/api/trpc/router';

export function createHelpers() {
  return createServerSideHelpers({
    router: appRouter,
    ctx: {},
    transformer: superjson,
  });
}
