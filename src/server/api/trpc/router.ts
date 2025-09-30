import { createTRPCRouter } from './context';
import { contentRouter } from '@/server/api/trpc/routers/content';

export const appRouter = createTRPCRouter({
  content: contentRouter,
});

export type AppRouter = typeof appRouter;
