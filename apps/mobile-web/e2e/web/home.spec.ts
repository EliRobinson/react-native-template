import { expect, test } from '@playwright/test';

test('home screen loads and increments counter', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Count: 0')).toBeVisible();

  await page.getByTestId('increment-button').click();
  await expect(page.getByText('Count: 1')).toBeVisible();
});
