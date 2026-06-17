import { z } from "zod";

export const statsSchema = z.object({
  totals: z.object({
    users: z.number(),
    resources: z.number(),
    comments: z.number(),
    events: z.number(),
  }),
  usersByZone: z.array(
    z.object({
      zone: z.string(),
      count: z.number(),
    }),
  ),
  topFavorites: z.array(
    z.object({
      title: z.string(),
      count: z.number(),
    }),
  ),
  topBookmarked: z.array(
    z.object({
      title: z.string(),
      count: z.number(),
    }),
  ),
});

export type IStatObject = z.infer<typeof statsSchema>;
