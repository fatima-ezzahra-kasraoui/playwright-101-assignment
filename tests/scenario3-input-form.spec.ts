import { test, expect } from '../fixtures/lambdatest';

test('Scenario 3 - Input Form Submit', async ({ page }) => {
  await page.goto('https://www.testmuai.com/selenium-playground/');
  await page.getByRole('link', { name: 'Input Form Submit' }).click();

  const submit = page.getByRole('button', { name: 'Submit' });
  const nameField = page.locator('input[name="name"]');

  // 1) Submit empty form -> validation error
  await submit.click();
  const validationMsg = await nameField.evaluate(
    (el: HTMLInputElement) => el.validationMessage
  );
  // Browser-native message (e.g. "Please fill out this field.") on the first empty required field
  expect(validationMsg).toMatch(/please fill/i);

  // 2) Fill every field
  await nameField.fill('John Doe');
  await page.locator('input[name="email"]').fill('john.doe@example.com');
  await page.locator('input[name="password"]').fill('Secret@123');
  await page.locator('input[name="company"]').fill('TestMu AI');
  await page.locator('input[name="website"]').fill('https://www.testmuai.com');
  await page.locator('select[name="country"]').selectOption({ label: 'United States' });
  await page.locator('input[name="city"]').fill('New York');
  await page.locator('input[name="address_line1"]').fill('123 Main Street');
  await page.locator('input[name="address_line2"]').fill('Suite 456');
  await page.locator('input[name="state"]').fill('NY');
  await page.locator('input[name="zip"]').fill('10001');

  // 3) Submit and verify success message
  await submit.click();
  await expect(
    page.getByText('Thanks for contacting us, we will get back to you shortly.')
  ).toBeVisible();
});
