export const COMMENT_MODERATION_ENUM = {
  Approved: "Approved",
  Pending: "Pending",
} as const;

export interface IModerationSelect {
  name: string;
  value: ICommentModeration;
}

export type ICommentModeration =
  (typeof COMMENT_MODERATION_ENUM)[keyof typeof COMMENT_MODERATION_ENUM];
