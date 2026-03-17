import z from "zod";

export const createCategorySchema = z.object({
  categoryName: z.string().trim().min(1, {
    error: "Veuillez entrez le nom de la catégorie",
  }),
});

export type createCategoryType = z.infer<typeof createCategorySchema>;
