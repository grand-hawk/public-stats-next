import z from 'zod';

export const vehicleSearchInput = z.object({
  amphibious: z.boolean().default(false),
  aps: z.boolean().default(false),
  classifications: z.array(z.string()).default([]),
  crewBands: z.array(z.string()).default([]),
  crewClasses: z.array(z.string()).default([]),
  eras: z.array(z.string()).default([]),
  ess: z.boolean().default(false),
  fcs: z.boolean().default(false),
  jammer: z.boolean().default(false),
  locomotions: z.array(z.string()).default([]),
  lws: z.boolean().default(false),
  maws: z.boolean().default(false),
  obtainments: z.array(z.string()).default([]),
  placeId: z.string(),
  powerBands: z.array(z.string()).default([]),
  query: z.string().default(''),
  speedBands: z.array(z.string()).default([]),
  stabilizer: z.boolean().default(false),
  teams: z.array(z.string()).default([]),
  thermal: z.boolean().default(false),
  weightBands: z.array(z.string()).default([]),
});

export type VehicleSearchInput = z.infer<typeof vehicleSearchInput>;
