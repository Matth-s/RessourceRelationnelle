import { expect, test } from "@playwright/test";

test("Création d'une catégorie", async ({ page }) => {
  await page.goto("/authentification/connexion");
  await page.getByLabel("email").fill("admin2@mail.com");
  await page.getByLabel("password").fill("Admin123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/");
  await page.getByRole("link", { name: "Catégories" }).click();
  await expect(page).toHaveURL("/categories");
  await page.getByRole("button", { name: "Ajouter une catégorie" }).click();
  await page.getByLabel("categoryName").fill("Catégorie automatisée");
  await page.getByRole("button", { name: "Ajouter" }).click();
  await expect(
    page.getByText("Vous venez de créer une nouvelle catégorie"),
  ).toBeVisible();
});

test("Modification d'une catégorie", async ({ page }) => {
  await page.goto("/authentification/connexion");
  await page.getByLabel("email").fill("admin2@mail.com");
  await page.getByLabel("password").fill("Admin123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/");
  await page.getByRole("link", { name: "Catégories" }).click();
  await expect(page).toHaveURL("/categories");
  const row = page.locator("tr", {
    has: page.getByText("CATÉGORIE AUTOMATISÉE"),
  });

  await row.getByLabel("edit").click();
  await page.getByLabel("categoryName").fill("Catégorie automatisée modifiée");
  await page.getByRole("button", { name: "Modifier" }).click();
  await expect(page.getByText("La catégorie a été mise à jour")).toBeVisible();
});

test("Suppression d'une catégorie", async ({ page }) => {
  await page.goto("/authentification/connexion");
  await page.getByLabel("email").fill("admin2@mail.com");
  await page.getByLabel("password").fill("Admin123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/");
  await page.getByRole("link", { name: "Catégories" }).click();
  await expect(page).toHaveURL("/categories");
  const row = page.locator("tr", {
    has: page.getByText("CATÉGORIE AUTOMATISÉE MODIFIÉE"),
  });

  await row.getByLabel("delete").click();
  await page.getByRole("button", { name: "Supprimer" }).click();
  await expect(
    page.getByText(
      "La catégorie CATÉGORIE AUTOMATISÉE MODIFIÉE a été supprimée",
    ),
  ).toBeVisible();
});
