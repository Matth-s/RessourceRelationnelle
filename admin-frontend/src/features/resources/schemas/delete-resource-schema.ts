import z from "zod";

export const deleteResourceSchema = z.object({
  resourceId: z.string(),
  confirm: z.string("Confirmer"),
});

export type deleteResourceType = z.infer<typeof deleteResourceSchema>;
