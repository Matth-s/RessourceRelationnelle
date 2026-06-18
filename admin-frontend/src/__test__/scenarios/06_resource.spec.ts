import { test, expect } from "@playwright/test";

test("Rejection d'une ressource", async ({ page }) => {
  await page.goto("/authentification/connexion");
  await page.getByLabel("email").fill("admin2@mail.com");
  await page.getByLabel("password").fill("Admin123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/");
  await page.getByRole("link", { name: "Ressources" }).click();
  await expect(page).toHaveURL("/ressources");
  await page.getByLabel("searchResource").fill("Ressource automatisée");
  await page.getByRole("link", { name: /ressource automatisée/i }).click();
  await page.getByRole("button", { name: "Edit" }).click();
  const publicationSelect = page.getByLabel("publicationStatus");
  await expect(publicationSelect).toBeVisible();
  await publicationSelect.click();
  await page.getByRole("option", { name: /Rejeté/i }).click();
  await page.getByRole("button", { name: "Modifier" }).click();
  await expect(page.getByText("Resource modifiée avec succès")).toBeVisible();
  await page.getByRole("link", { name: "Ressources" }).click();
  await expect(page).toHaveURL("/ressources");
  await page.getByLabel("searchResource").fill("Ressource automatisée");
  const card = await page.getByRole("link", { name: /ressource automatisée/i });
  await expect(card.getByText(/status\s*:\s*Rejeté/i)).toBeVisible();
});

test("Validation d'une ressource", async ({ page }) => {
  await page.goto("/authentification/connexion");
  await page.getByLabel("email").fill("admin2@mail.com");
  await page.getByLabel("password").fill("Admin123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/");
  await page.getByRole("link", { name: "Ressources" }).click();
  await expect(page).toHaveURL("/ressources");
  await page.getByLabel("searchResource").fill("Ressource automatisée");
  await page.getByRole("link", { name: /ressource automatisée/i }).click();
  await page.getByRole("button", { name: "Edit" }).click();
  const publicationSelect = page.getByLabel("publicationStatus");
  await expect(publicationSelect).toBeVisible();
  await publicationSelect.click();
  await page.getByRole("option", { name: /Approuvé/i }).click();
  await page.getByRole("button", { name: "Modifier" }).click();
  await expect(page.getByText("Resource modifiée avec succès")).toBeVisible();
  await page.getByRole("link", { name: "Ressources" }).click();
  await expect(page).toHaveURL("/ressources");
  await page.getByText("Ressource automatisé").click();
  await page.getByLabel("searchResource").fill("Ressource automatisée");

  const card = await page.getByRole("link", { name: /ressource automatisée/i });
  await expect(card.getByText(/status\s*:\s*Approuvé/i)).toBeVisible();
});

test("Suppression d'une ressource", async ({ page }) => {
  await page.goto("/authentification/connexion");
  await page.getByLabel("email").fill("admin2@mail.com");
  await page.getByLabel("password").fill("Admin123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/");
  await page.getByRole("link", { name: "Ressources" }).click();
  await expect(page).toHaveURL("/ressources");
  await page.getByLabel("searchResource").fill("Ressource automatisée");
  await page.getByRole("link", { name: /ressource automatisée/i }).click();
  await page.getByRole("button", { name: "Supprimer" }).click();
  await page.getByLabel("confirm").fill("Confirmer");
  await page.getByRole("button", { name: "Supprimer" }).click();
  await expect(
    page.getByText(
      "La ressource : Ressource automatisée a été supprimé avec succès",
    ),
  ).toBeVisible();
});
