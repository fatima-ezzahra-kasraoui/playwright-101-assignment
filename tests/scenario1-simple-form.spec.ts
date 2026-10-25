import { test, expect } from '../fixtures/lambdatest';

test('Scenario 1 - Simple Form Demo', async ({ page }) => {
  await page.goto('https://www.testmuai.com/selenium-playground/');

  // Locator #1: role-based
  await page.getByRole('link', { name: 'Simple Form Demo' }).click();
  await expect(page).toHaveURL(/simple-form-demo/);
  await page.waitForLoadState('networkidle');

  const message = 'Welcome to TestMu AI';

  // Locator #2: placeholder
  await page.getByPlaceholder('Please enter your Message').fill(message);

  // Locator #3: id (button) - retried until the page script reacts
  const button = page.locator('#showInput');
  const output = page.locator('#message');
  await expect(async () => {
    await button.click();
    await expect(output).toHaveText(message, { timeout: 3000 });
  }).toPass({ timeout: 30_000 });
});
