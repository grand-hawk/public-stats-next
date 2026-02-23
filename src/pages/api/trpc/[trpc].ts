import { createNextApiHandler } from '@trpc/server/adapters/next';

import { IS_DEV } from '@/env';
import { appRouter } from '@/server/api/trpc/router';

export default createNextApiHandler({
  router: appRouter,
  onError: IS_DEV
    ? ({ error, path }) => {
        console.error(
          `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
        );
      }
    : undefined,
});
