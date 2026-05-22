import { expect, test } from "@playwright/test";

test("Création d'un commentaire", async ({ page }) => {
  await page.goto("/authentification/connexion");
  await page.getByLabel("email").fill("admin2@mail.com");
  await page.getByLabel("password").fill("Admin123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/");
  await page.getByRole("link", { name: "Ressources" }).click();
  await expect(page).toHaveURL("/ressources");
  await page.getByLabel("searchResource").fill("Ressource automatisée");
  await page.getByRole("link", { name: /ressource automatisée/i }).click();
  await page.getByLabel("comment").fill("Ceci est un commentaire de test");
  await page.getByRole("button", { name: "Poster" }).click();
  await expect(page.getByText("Votre commentaire a été posté")).toBeVisible();
});

test("Modification d'un commentaire", async ({ page }) => {
  await page.goto("/authentification/connexion");
  await page.getByLabel("email").fill("admin2@mail.com");
  await page.getByLabel("password").fill("Admin123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/");
  await page.getByRole("link", { name: "Commentaires" }).click();
  await expect(page).toHaveURL("/commentaires");
  const row = page.locator("tr", {
    has: page.getByText("Ceci est un commentaire de test"),
  });

  await row.getByLabel("edit").click();
  const moderationSelect = page.getByLabel("moderationStatus");
  await expect(moderationSelect).toBeVisible();
  await moderationSelect.click();
  await page.getByRole("option", { name: /En attente/i }).click();
  await page.getByRole("button", { name: "Mettre à jour" }).click();
  await expect(page.getByText("Le commentaire a été modifié")).toBeVisible();
});

test("Suppression d'un commentaire", async ({ page }) => {
  await page.goto("/authentification/connexion");
  await page.getByLabel("email").fill("admin2@mail.com");
  await page.getByLabel("password").fill("Admin123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/");
  await page.getByRole("link", { name: "Commentaires" }).click();
  await expect(page).toHaveURL("/commentaires");
  const row = page.locator("tr", {
    has: page.getByText("Ceci est un commentaire de test"),
  });

  await row.getByLabel("edit").click();
  await page.getByRole("button", { name: "Supprimer" }).click();
  await expect(page.getByText("Le commentaire a été supprimé")).toBeVisible();
});
