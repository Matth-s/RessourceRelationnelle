import { test, expect } from 'playwright/test';

test('Creation de ressource avec lien yt', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByLabel('email').fill('alice.demo@rr.local');
  await page.getByLabel('password').fill('Demo123!');
  await page.getByLabel('submit').click();

  await expect(page).toHaveURL('/home');

  const menu = page.getByLabel('menu');

  if (await menu.isVisible()) {
    await menu.click();
  }

  await page.getByRole('link', { name: '+ Créer' }).click();

  await expect(page).toHaveURL('/resources/create');

  await page.getByLabel('title').fill('Test playwright');
  await page.getByLabel('resume').fill('Resumé de test playwright');
  await page.getByLabel('content').fill('Resumé de test playwright');

  await page.getByLabel('resourceTypeId').selectOption({ index: 1 });
  await page.getByLabel('relationTypeId').selectOption({ index: 1 });
  await page.getByLabel('categoryId').selectOption({ index: 1 });
  await page
    .getByLabel('yt-link')
    .fill('https://www.youtube.com/watch');

  await page.getByLabel('submit').click();

  await expect(page).toHaveURL('/resources');
});
