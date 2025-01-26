import { createNextApiHandler } from '@trpc/server/adapters/next';

import { env } from '@/env';
import { appRouter } from '@/server/api/trpc/router';

export default createNextApiHandler({
  router: appRouter,
  onError:
    env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
          );
        }
      : undefined,
  responseMeta({ errors, type }) {
    const allOk = errors.length === 0;
    const isQuery = type === 'query';

    if (allOk && isQuery)
      return {
        headers: new Headers([
          ['cache-control', `s-maxage=1, stale-while-revalidate=${60 * 60}`],
        ]),
      };

    return {};
  },
});
