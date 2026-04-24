import { PUBLICATION_RESOURCE_KEY } from "@/types/resource-type";
import z from "zod";

export const resourceObjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  resume: z.string(),
  content: z.string(),
  isVisible: z.boolean(),
  publicationStatus: z.enum(PUBLICATION_RESOURCE_KEY),
  updatedAt: z.string(),
  publishedAt: z.string(),
  createdAt: z.string(),
  mediaType: z.string(),
  mediaUrl: z.string(),
  viewCount: z.number(),
  user: z.object({ id: z.string(), username: z.string() }),
  category: z.object({ id: z.string(), categoryName: z.string() }),
  typeResource: z.object({ id: z.string(), typeRessource: z.string() }),
  typeRelation: z.object({
    id: z.string(),
    typeRelation: z.string(),
  }),
});

export const resourceArraySchema = z.array(resourceObjectSchema);

export type resourceObjectType = z.infer<typeof resourceObjectSchema>;
export type resourceArrayType = z.infer<typeof resourceArraySchema>;
