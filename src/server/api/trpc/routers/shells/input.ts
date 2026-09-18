import z from 'zod';

export const shellSearchInput = z.object({
  calibres: z.array(z.string()).default([]),
  damage: z.array(z.string()).default([]),
  explosive: z.boolean().default(false),
  explosiveMass: z.array(z.string()).default([]),
  guided: z.boolean().default(false),
  irccm: z.boolean().default(false),
  laser: z.boolean().default(false),
  mass: z.array(z.string()).default([]),
  penetration: z.array(z.string()).default([]),
  placeId: z.string(),
  query: z.string().default(''),
  types: z.array(z.string()).default([]),
  unjammable: z.boolean().default(false),
  velocity: z.array(z.string()).default([]),
});

export type ShellSearchInput = z.infer<typeof shellSearchInput>;
