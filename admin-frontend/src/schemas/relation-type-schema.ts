import z from "zod";

export const relationTypeObjectSchema = z.object({
  id: z.string(),
  typeRelation: z.string(),
});

export const relationTypeArraySchema = z.array(relationTypeObjectSchema);

export type relationTypeArrayType = z.infer<typeof relationTypeArraySchema>;
