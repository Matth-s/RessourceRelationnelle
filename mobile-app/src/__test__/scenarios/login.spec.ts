import { test, expect } from 'playwright/test';

test('Test sur la connexion doit retourner une erreur => Email ou mot de passe invalide', async ({
  page,
}) => {
  await page.goto('/auth/login');

  await page.getByLabel('email').fill('wrong@mail.com');
  await page.getByLabel('password').fill('wrongpassword');
  await page.getByLabel('submit').click();

  await expect(
    page.getByText(
      'Email ou mot de passe incorrect, ou données invalides',
    ),
  ).toBeVisible();
});
