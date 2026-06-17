import { exportStatsToPdf } from "@/features/statistics/helpers/export-stats-pdf";
import type { IStatObject } from "@/features/statistics/schemas/stats-schema";
import { describe, it, expect, vi, beforeEach } from "vitest";
import autoTable from "jspdf-autotable";

vi.mock("jspdf", () => {
  const jsPDF = vi.fn();
  jsPDF.prototype.text = vi.fn();
  jsPDF.prototype.setFontSize = vi.fn();
  jsPDF.prototype.setTextColor = vi.fn();
  jsPDF.prototype.save = vi.fn();
  return { jsPDF };
});

vi.mock("jspdf-autotable", () => ({
  default: vi.fn(),
}));

describe("export les stats en pdf", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ca ne doit pas appeler l autoTbale pour les sections vide", () => {
    const emptyStats: IStatObject = {
      totals: { users: 0, resources: 0, comments: 0, events: 0 },
      usersByZone: [],
      topFavorites: [],
      topBookmarked: [],
    };

    exportStatsToPdf(emptyStats);

    expect(autoTable).toHaveBeenCalledTimes(1);
  });
});
