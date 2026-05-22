import { test, expect } from 'playwright/test';

test('Doit poster un commentaire', async ({ page }) => {
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

  const inputComment = page.getByLabel('post-comment');

  await inputComment.fill('Commentaire test de playwright');

  await page.getByLabel('submit-comment').click();

  await expect(inputComment).toHaveText('');
});
