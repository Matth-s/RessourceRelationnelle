import z from "zod";

export const categoryObjectSchema = z.object({
  id: z.uuid(),
  categoryName: z.string(),
  ressources: z.array(z.any()).optional(),
});

export const categoriesArraySchema = z.array(categoryObjectSchema);

export type categoriesArrayType = z.infer<typeof categoriesArraySchema>;
export type categorySchemaType = z.infer<typeof categoryObjectSchema>;
