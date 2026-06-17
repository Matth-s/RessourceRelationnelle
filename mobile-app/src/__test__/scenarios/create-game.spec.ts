import { test, expect } from 'playwright/test';

test('Doit créer une partie morpion', async ({ page }) => {
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

  await page.goto('/resources/00fd0214-fb10-4cd6-a5ce-105e6fee4d3c');

  await expect(page).toHaveURL(
    '/resources/00fd0214-fb10-4cd6-a5ce-105e6fee4d3c',
  );

  await page.getByLabel('create-game').click();

  await expect(page).toHaveURL(/game/);
});
