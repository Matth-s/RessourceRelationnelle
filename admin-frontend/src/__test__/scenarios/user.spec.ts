import { expect, test } from "@playwright/test";

test("Création d'un utilisateur", async ({ page }) => {
  await page.goto("/authentification/connexion");
  await page.getByLabel("email").fill("admin2@mail.com");
  await page.getByLabel("password").fill("Admin123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/");
  await page.getByRole("link", { name: "Utilisateurs" }).click();
  await expect(page).toHaveURL("/utilisateurs");
  await page.getByRole("button", { name: "Ajouter un utilisateur" }).click();
  await page.getByLabel("Email").fill("utilisateur.automatise@mail.com");
  await page.getByLabel("Username").fill("user.auto");
  await page.getByLabel("Roles").click();
  await page
    .getByRole("option")
    .filter({ hasText: /^Admin$/ })
    .click();
  await page.getByLabel("closeDropdown").click();

  await page.getByTestId("password-input").fill("MotDePasse123!");
  await page.getByTestId("confirm-password-input").fill("MotDePasse123!");
  await page.getByRole("button", { name: "Créer", exact: true }).click();
  await expect(
    page.getByText("L'utilisateur a été créé avec succès"),
  ).toBeVisible();
});

test("Modification d'un utilisateur", async ({ page }) => {
  await page.goto("/authentification/connexion");
  await page.getByLabel("email").fill("admin2@mail.com");
  await page.getByLabel("password").fill("Admin123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/");
  await page.getByRole("link", { name: "Utilisateurs" }).click();
  await expect(page).toHaveURL("/utilisateurs");
  const row = page.locator("tr", {
    has: page.getByText("utilisateur.automatise@mail.com"),
  });

  await row.getByLabel("edit").click();
  await page.getByLabel("Email").fill("utilisateur.automatisemodif@mail.com");
  await page.getByRole("button", { name: "Modifier" }).click();
  await expect(page.getByText("L'utilisateur a été modifié")).toBeVisible();
});

test("Suppression d'un utilisateur", async ({ page }) => {
  await page.goto("/authentification/connexion");
  await page.getByLabel("email").fill("admin2@mail.com");
  await page.getByLabel("password").fill("Admin123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/");
  await page.getByRole("link", { name: "Utilisateurs" }).click();
  await expect(page).toHaveURL("/utilisateurs");
  const row = page.locator("tr", {
    has: page.getByText("utilisateur.automatisemodif@mail.com"),
  });

  await row.getByLabel("delete").click();
  await page.getByLabel("confirmUsername").fill("user.auto");
  await page.getByRole("button", { name: "Supprimer" }).click();
  await expect(
    page.getByText("L'utilisateur user.auto a été supprimé avec succès"),
  ).toBeVisible();
});
