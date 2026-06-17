import { test, expect } from '@playwright/test';

test('Le profil utilisateur doit afficher les 4 onglets de ressource', async ({
  page,
}) => {
  await page.goto('/auth/login');

  await page.getByLabel('email').fill('alice.demo@rr.local');
  await page.getByLabel('password').fill('Demo123!');
  await page.getByLabel('submit').click();

  await expect(page).toHaveURL('/home');

  const menu = page.getByLabel('menu');

  if (await menu.isVisible()) {
    await menu.click();
  }

  await page.getByLabel('profile').click();

  await expect(page).toHaveURL('/profile');
  const favoritesText = page.getByLabel('favorites');
  const bookmarksText = page.getByLabel('bookmarks');
  const myResourcesText = page.getByLabel('myResources');
  const historyText = page.getByLabel('history');

  await expect(favoritesText).toBeVisible();
  await expect(bookmarksText).toBeVisible();
  await expect(myResourcesText).toBeVisible();
  await expect(historyText).toBeVisible();
});
