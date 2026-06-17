import { expect, test } from 'playwright/test';

test('Doit se déconnecter doit mettre a jour le header', async ({
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

  await page.getByLabel('logout').click();

  await expect(page.getByLabel('logout')).toBeHidden();

  await expect(page).toHaveURL('/');
});
