import { describe, it, expect } from "vitest";

import {
  formatCommentModerationStatus,
  getUniquesDateComment,
} from "@/features/comments/helpers/comments-helper";

describe("format comment moderation status", () => {
  it("doit retourne valide si status est approuvé", () => {
    const result = formatCommentModerationStatus("Approved");

    expect(result).toBe("Validé");
  });

  it("ca doit retourne en attente pour Pending", () => {
    const result = formatCommentModerationStatus("Pending");

    expect(result).toBe("En attente");
  });

  it("ca doit retourne Inconnu pour un type non reconnu dans le switch", () => {
    const result = formatCommentModerationStatus("Unknown" as never);

    expect(result).toBe("Inconnu");
  });
});

describe("getUniquesDateComment", () => {
  it("ca doit retourner des dates uniques", () => {
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

  it(" ca doit retourner un tableau s il n y pas de commnetaire", () => {
    const result = getUniquesDateComment([]);

    expect(result).toEqual([]);
  });
});
