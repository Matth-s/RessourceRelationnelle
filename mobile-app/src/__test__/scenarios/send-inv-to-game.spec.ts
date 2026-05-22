import { test, expect } from 'playwright/test';

test('Inviter un joueur a jouer', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['clipboard-read', 'clipboard-write'],
  });

  const page = await context.newPage();

  await page.goto('/home');

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

  const copyPath = page.getByLabel('copy-url-game');

  await expect(copyPath).toHaveText('Copier le lien');

  await copyPath.click();

  await expect(copyPath).toHaveText('Copié !');

  await expect(copyPath).toHaveText('Copier le lien', {
    timeout: 3000,
  });
});
