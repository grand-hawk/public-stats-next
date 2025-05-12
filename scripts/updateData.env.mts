import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    ANALYTICS_API_HOST: z.string(),
    ANALYTICS_API_AUTH: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
