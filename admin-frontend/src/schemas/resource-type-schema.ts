import z from "zod";

export const resourceTypeObjectSchema = z.object({
  id: z.string(),
  typeRessource: z.string(),
});

export const resourceTypeArraySchema = z.array(resourceTypeObjectSchema);

export type resourceTypeArrayType = z.infer<typeof resourceTypeArraySchema>;
