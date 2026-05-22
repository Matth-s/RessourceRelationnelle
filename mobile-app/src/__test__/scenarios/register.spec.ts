import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

test('inscription nouveau compte utilisateur', async ({ page }) => {
  await page.goto('/auth/register');

  await page.goto('/auth/register');

  await page.getByLabel('firstname').fill(uuidv4().split('-')[0]);
  await page.getByLabel('lastname').fill('Doe');
  await page
    .getByLabel('email')
    .fill(`${uuidv4().split('-')[0]}@test.com`);
  await page.getByTestId('password-input').fill('Password123!');
  await page
    .getByTestId('confirm-password-input')
    .fill('Password123!');
  await page.getByLabel('acceptTerms').check();
  await page.getByLabel('submit').click();

  await expect(page).toHaveURL('/auth/login');
});
