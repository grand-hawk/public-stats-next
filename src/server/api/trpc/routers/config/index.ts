import { publicProcedure } from '@/server/api/trpc/context';
import { getConfig } from '@generated/config';

import type { Default } from '@generated/config';

export const configRouter = publicProcedure.query((): Default => {
  return getConfig();
});
