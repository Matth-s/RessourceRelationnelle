import { PUBLICATION_RESOURCE_KEY } from "@/types/resource-type";
import z from "zod";

export const createOrUpdateSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  resume: z.string().max(200, "Le résumé ne doit pas dépasser 200 caractères"),
  content: z.string().min(10, "Le contenu est requis"),
  file: z.instanceof(File).optional(),
  categoryId: z.uuid(),
  resourceTypeId: z.uuid(),
  relationTypeId: z.uuid(),
  mediaType: z.string(),
  isVisible: z.boolean(),
  publicationStatus: z.enum(PUBLICATION_RESOURCE_KEY),
});

export type createOrUpdateSchemaType = z.infer<typeof createOrUpdateSchema>;
