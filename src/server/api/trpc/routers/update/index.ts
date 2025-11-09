import { on } from 'node:events';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { sse } from '@generated/sse';

export const updateRouter = createTRPCRouter({
  onUpdate: publicProcedure.subscription(async function* ({ signal }) {
    for await (const _ of on(sse, '_settled', { signal })) yield true;
  }),
});
