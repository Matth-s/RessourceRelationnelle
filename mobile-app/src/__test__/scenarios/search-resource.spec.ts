import { test, expect } from 'playwright/test';

test("Recherche textuelle d'une ressource", async ({ page }) => {
  await page.goto('/resources');

  const searchBar = page.getByLabel('search-text');

  await searchBar.fill('ycveuce');

  await expect(page.getByLabel('search-result')).toHaveText(
    '0 ressources trouvées',
  );
});
