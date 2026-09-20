import { z } from 'zod';

import { env } from '@/env';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { hasCms } from '@/server/utils/cms';
import { fetchUpdate, fetchUpdates } from '@/server/utils/updates/fetch';
import { isPreviewAuthorised } from '@/server/utils/updates/previewToken';
import { getNameFromPlaceId } from '@/utils/placeUtils';
import { getConfig } from '@generated/config';

import type {
  Update,
  UpdateSummary,
  UpdateView,
} from '@/server/utils/updates/types';
import type { PlaceId } from '@generated/config';

export type { Update, UpdateSummary, UpdateView };

const placeName = (placeId: string) =>
  getNameFromPlaceId(getConfig().data, placeId as PlaceId);

export const updatesRouter = createTRPCRouter({
  enabled: publicProcedure.query((): boolean => hasCms()),

  list: publicProcedure
    .input(z.object({ placeId: z.string() }))
    .query(async ({ input }): Promise<UpdateSummary[]> => {
      const place = placeName(input.placeId);

      return place ? fetchUpdates(place) : [];
    }),

  bySlug: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
        slug: z.string().max(200),
        preview: z.string().max(200).optional(),
      }),
    )
    .query(async ({ input }): Promise<UpdateView | null> => {
      const place = placeName(input.placeId);
      if (!place) return null;

      return fetchUpdate(place, input.placeId as PlaceId, input.slug, {
        preview: isPreviewAuthorised(
          input.preview,
          input.slug,
          env.UPDATES_PREVIEW_SECRET,
        ),
      });
    }),
});
