import { on, EventEmitter } from 'node:events';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { sse } from '@generated/sse';

export const updateRouter = createTRPCRouter({
  onUpdate: publicProcedure.subscription(async function* ({ signal }) {
    const combined = new EventEmitter();

    const handleUpdate = () => combined.emit('tick', true);
    sse.on('_settled', handleUpdate);

    const interval = setInterval(() => combined.emit('tick', false), 30_000);

    const cleanup = () => {
      sse.off('_settled', handleUpdate);
      clearInterval(interval);
    };
    signal?.addEventListener('abort', cleanup);

    try {
      for await (const [value] of on(combined, 'tick', { signal }))
        yield value as boolean;
    } finally {
      cleanup();
    }
  }),
});
