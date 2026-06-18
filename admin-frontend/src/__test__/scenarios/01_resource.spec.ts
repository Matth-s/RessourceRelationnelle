import { test, expect } from "@playwright/test";

test("Création d'une ressource", async ({ page }) => {
  await page.goto("/authentification/connexion");
  await page.getByLabel("email").fill("admin2@mail.com");
  await page.getByLabel("password").fill("Admin123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/");
  await page.getByRole("link", { name: "Ressources" }).click();
  await expect(page).toHaveURL("/ressources");
  await page.getByRole("button", { name: "Ajouter une ressource" }).click();
  await expect(page).toHaveURL("/ressources/nouvelle-ressource");
  await page.getByLabel("title").fill("Ressource automatisée");
  await page.getByRole("button", { name: "Soumettre" }).click();
  const publicationSelect = page.getByLabel("publicationStatus");
  await expect(publicationSelect).toBeVisible();
  await publicationSelect.click();
  await page.getByRole("option", { name: /En attente/i }).click();
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(
    page.getByText("La ressource a été crée avec succès"),
  ).toBeVisible();
});
