import { test, expect } from 'playwright/test';

test('Test sur les filtres des catalogues', async ({ page }) => {
  await page.goto('/resources');
  const panel = page.getByLabel('filters-panel');

  await expect(panel).toBeHidden();

  await page.getByLabel('filter').click();

  await expect(panel).toBeVisible();
});
