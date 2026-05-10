import { describe, it, expect } from "vitest";

import { formatCurrentLocation } from "@/helpers/format-current-location";

describe("formatCurrentLocation", () => {
  it("should return Dashboard for /", () => {
    expect(formatCurrentLocation("/")).toBe("Dashboard");
  });

  it("should return Ressources for /ressources", () => {
    expect(formatCurrentLocation("/ressources")).toBe("Ressources");
  });

  it("should return Catégories for /categories", () => {
    expect(formatCurrentLocation("/categories")).toBe("Catégories");
  });

  it("should return Utilisateurs for /utilisateurs", () => {
    expect(formatCurrentLocation("/utilisateurs")).toBe("Utilisateurs");
  });

  it("should return Statistiques for /statistiques", () => {
    expect(formatCurrentLocation("/statistiques")).toBe("Statistiques");
  });

  it("should return Commentaires for /commentaires", () => {
    expect(formatCurrentLocation("/commentaires")).toBe("Commentaires");
  });

  it("should be case insensitive", () => {
    expect(formatCurrentLocation("/RESSOURCES")).toBe("Ressources");
  });

  it("should return empty string for unknown path", () => {
    expect(formatCurrentLocation("/unknown")).toBe("");
  });

  it("should return empty string for empty path", () => {
    expect(formatCurrentLocation("")).toBe("");
  });
});
