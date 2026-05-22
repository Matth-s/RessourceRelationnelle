import { test, expect } from 'playwright/test';

test('Doit mettre en bookmark une ressource', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByLabel('email').fill('alice.demo@rr.local');
  await page.getByLabel('password').fill('Demo123!');
  await page.getByLabel('submit').click();

  await expect(page).toHaveURL('/home');

  const menu = page.getByLabel('menu');

  if (await menu.isVisible()) {
    await menu.click();
  }

  await page.getByLabel('resource-link').click();
  await expect(page).toHaveURL('/resources');

  await page.getByLabel('resource-card-link').nth(1).click();

  const bookmarkButton = page.getByLabel('bookmark-button');

  await expect(bookmarkButton).toHaveText('Mettre de côté');

  await bookmarkButton.click();

  await expect(bookmarkButton).toHaveText('Mis de côté');
});
