import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { env } from '@/env';
import { appRouter } from '@/server/api/trpc/router';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
    onError:
      env.NODE_ENV === 'development'
        ? ({ error, path }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };
