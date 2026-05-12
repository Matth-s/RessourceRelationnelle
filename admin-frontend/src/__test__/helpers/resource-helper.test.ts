import {
  formatPublicationStatus,
  getMediaType,
  getResourceLengthByType,
} from "@/features/resources/helpers/resource-helper";
import type { resourceArrayType } from "@/features/resources/schemas/ressource-schema";
import { describe, it, expect } from "vitest";

describe("resources helpers", () => {
  describe("formatPublicationStatus", () => {
    it("doit traduire correctement les statuts anglais en français", () => {
      expect(formatPublicationStatus("Approved")).toBe("Appouvé");
      expect(formatPublicationStatus("Pending")).toBe("En attente");
      expect(formatPublicationStatus("Rejected")).toBe("Rejeté");
    });

    it("doit retourner 'Inconnue' pour un statut non gere", () => {
      // @ts-expect-error test de value hors champs
      expect(formatPublicationStatus("UnknownStatus")).toBe("Inconnue");
    });
  });

  describe("getMediaType", () => {
    it("doit detecter correctement les types de fichiers", () => {
      const imgFile = new File([""], "test.png", { type: "image/png" });
      const pdfFile = new File([""], "doc.pdf", { type: "application/pdf" });
      const unknownFile = new File([""], "data.txt", { type: "text/plain" });

      expect(getMediaType(imgFile)).toBe("image");
      expect(getMediaType(pdfFile)).toBe("pdf");
      expect(getMediaType(unknownFile)).toBe(null);
    });

    it("doit retourner 'other' si aucun fichier n est fourni", () => {
      expect(getMediaType(null)).toBe("other");
    });
  });

  describe("getResourceLengthByType", () => {
    const mockData = [
      { id: "1", publicationStatus: "Approved" },
      { id: "2", publicationStatus: "Pending" },
      { id: "3", publicationStatus: "Approved" },
    ] as resourceArrayType;

    it("doit retourner la longueur totale si aucun statut n est fourni", () => {
      expect(getResourceLengthByType({ data: mockData })).toBe(3);
    });

    it("doit filtrer correctement par statut de publication", () => {
      const length = getResourceLengthByType({
        data: mockData,
        publicationStatus: "Approved",
      });
      expect(length).toBe(2);
    });
  });
});
