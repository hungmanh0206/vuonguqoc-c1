import { expect, test } from '@playwright/test';

test('visitors can navigate from the home page to class memories', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1, name: /Một thời thanh xuân/ })).toBeVisible();
  await page.getByRole('link', { name: 'Khám phá kỷ niệm', exact: true }).click();
  await expect(page).toHaveURL('/memories');
  await expect(page.getByRole('heading', { level: 1, name: 'Kỷ niệm' })).toBeVisible();
});
