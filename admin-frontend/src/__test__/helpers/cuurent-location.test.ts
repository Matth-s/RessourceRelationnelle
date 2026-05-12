import { describe, it, expect } from "vitest";

import { formatCurrentLocation } from "@/helpers/format-current-location";

describe("formatCurrentLocation", () => {
  it("ca doit retourner Dashboard pour /", () => {
    expect(formatCurrentLocation("/")).toBe("Dashboard");
  });

  it("ca doit retourner Ressources pour /ressources", () => {
    expect(formatCurrentLocation("/ressources")).toBe("Ressources");
  });

  it("ca doit retourner Catégories pour /categories", () => {
    expect(formatCurrentLocation("/categories")).toBe("Catégories");
  });

  it("ca doit retourner Utilisateurs pour /utilisateurs", () => {
    expect(formatCurrentLocation("/utilisateurs")).toBe("Utilisateurs");
  });

  it("ca doit retourner Statistiques pour /statistiques", () => {
    expect(formatCurrentLocation("/statistiques")).toBe("Statistiques");
  });

  it("ca doit retourner Commentaires pour /commentaires", () => {
    expect(formatCurrentLocation("/commentaires")).toBe("Commentaires");
  });

  it("ca doit etre insensible a la casse", () => {
    expect(formatCurrentLocation("/RESSOURCES")).toBe("Ressources");
  });

  it("ca doit retourner une chaine de caractere vide pour un path inconnu", () => {
    expect(formatCurrentLocation("/unknown")).toBe("");
  });

  it("ca doit retourner une chaine de caractere vide pour un path vide", () => {
    expect(formatCurrentLocation("")).toBe("");
  });
});
