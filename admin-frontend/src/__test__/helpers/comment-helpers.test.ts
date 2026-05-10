import { describe, it, expect } from "vitest";

import {
  formatCommentModerationStatus,
  getUniquesDateComment,
} from "@/features/comments/helpers/comments-helper";

describe("formatCommentModerationStatus", () => {
  it("should return 'Validé' for Approved", () => {
    const result = formatCommentModerationStatus("Approved");

    expect(result).toBe("Validé");
  });

  it("should return 'En attente' for Pending", () => {
    const result = formatCommentModerationStatus("Pending");

    expect(result).toBe("En attente");
  });

  it("should return 'Inconnu' for unknown status", () => {
    const result = formatCommentModerationStatus("Unknown" as never);

    expect(result).toBe("Inconnu");
  });
});

describe("getUniquesDateComment", () => {
  it("should return unique formatted dates", () => {
    const comments = [
      {
        createdAt: new Date("2025-01-01"),
      },
      {
        createdAt: new Date("2025-01-01"),
      },
      {
        createdAt: new Date("2025-01-02"),
      },
    ] as never;

    const result = getUniquesDateComment(comments);

    expect(result).toHaveLength(2);
  });

  it("should return empty array if no comments", () => {
    const result = getUniquesDateComment([]);

    expect(result).toEqual([]);
  });
});
