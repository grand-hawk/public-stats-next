import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import places_json from '@config/places.json';

const places = places_json as Record<string, number>;

export const configRouter = createTRPCRouter({
  places: publicProcedure.query(async () => {
    return places;
  }),
});
