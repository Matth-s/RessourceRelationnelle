import { expect, test } from "@playwright/test";

test("Export des statistiques", async ({ page }) => {
  await page.goto("/authentification/connexion");
  await page.getByLabel("email").fill("admin2@mail.com");
  await page.getByLabel("password").fill("Admin123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/");
  const downloadPromise = page.waitForEvent("download");

  await page.getByRole("button", { name: "Exporter en PDF" }).click();

  const download = await downloadPromise;

  const filename = download.suggestedFilename();
  expect(filename).toMatch(/^statistiques-\d{4}-\d{2}-\d{2}\.pdf$/);

  const path = await download.path();
  expect(path).toBeTruthy();
});
