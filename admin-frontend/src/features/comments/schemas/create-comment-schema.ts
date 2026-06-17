import z from "zod";

export const createCommentSchema = z.object({
  content: z.string().trim().min(1, {
    error: "Veuillez entrer un message",
  }),
  resourceId: z.uuid(),
});

export type createCommentType = z.infer<typeof createCommentSchema>;
