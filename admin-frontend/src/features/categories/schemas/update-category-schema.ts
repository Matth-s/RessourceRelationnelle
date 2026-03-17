import z from "zod";

export const updateCategorySchema = z.object({
  id: z.uuid(),
  categoryName: z.string().min(1, {
    error: "Veuillez entrez le nom de la catégorie",
  }),
});

export type updateCategoryType = z.infer<typeof updateCategorySchema>;
