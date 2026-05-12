import { describe, it, expect, vi, beforeEach } from "vitest";
import { api } from "@/lib/axios-client";
import type { IStatObject } from "@/features/statistics/schemas/stats-schema";
import { getStatisticsApi } from "@/features/statistics/api/get-statistics-api";

vi.mock("@/lib/axios-client", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("stats api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("doit retourner des stats valide", async () => {
    const mockStatsResponse: IStatObject = {
      totals: {
        users: 150,
        resources: 45,
        comments: 320,
        events: 12,
      },
      usersByZone: [
        { zone: "Occitanie", count: 80 },
        { zone: "Île-de-France", count: 70 },
      ],
      topFavorites: [{ title: "Gérer son stress", count: 25 }],
      topBookmarked: [{ title: "Méditation guidée", count: 40 }],
    };

    vi.mocked(api.get).mockResolvedValue({ data: mockStatsResponse });

    const result = await getStatisticsApi();

    expect(api.get).toHaveBeenCalledWith("/statistics");
    expect(result.totals.users).toBe(150);
    expect(result.usersByZone).toHaveLength(2);
    expect(result.usersByZone[0].zone).toBe("Occitanie");
  });

  it("doit retourner une erreur si le schema est invalide", async () => {
    const corruptedData = {
      usersByZone: [],
      topFavorites: [],
      topBookmarked: [],
    };

    vi.mocked(api.get).mockResolvedValue({ data: corruptedData });

    await expect(getStatisticsApi()).rejects.toThrow();
  });
});
