import { test, expect } from '../fixtures/lambdatest';

test('Scenario 3 - Input Form Submit', async ({ page }) => {
  await page.goto('https://www.testmuai.com/selenium-playground/');
  await page.getByRole('link', { name: 'Input Form Submit' }).click();

  // Scope everything to the demo form (the page footer has other "email" inputs)
  const form = page.locator('form').filter({ has: page.locator('#inputEmail4') });
  const submit = form.getByRole('button', { name: 'Submit' });
  const nameField = form.getByPlaceholder('Name', { exact: true });

  // 1) Submit empty form -> validation error
  await submit.click();
  const validationMsg = await nameField.evaluate(
    (el: HTMLInputElement) => el.validationMessage
  );
  expect(validationMsg).toMatch(/please fill/i);

  // 2) Fill every field
  await nameField.fill('John Doe');
  await form.getByPlaceholder('Email', { exact: true }).fill('john.doe@example.com');
  await form.getByPlaceholder('Password', { exact: true }).fill('Secret@123');
  await form.getByPlaceholder('Company', { exact: true }).fill('TestMu AI');
  await form.getByPlaceholder('Website', { exact: true }).fill('https://www.testmuai.com');
  await form.locator('select').selectOption({ label: 'United States' });
  await form.getByPlaceholder('City', { exact: true }).fill('New York');
  await form.getByPlaceholder('Address 1', { exact: true }).fill('123 Main Street');
  await form.getByPlaceholder('Address 2', { exact: true }).fill('Suite 456');
  await form.getByPlaceholder('State', { exact: true }).fill('NY');
  await form.getByPlaceholder('Zip code', { exact: true }).fill('10001');

  // 3) Submit and verify success message
  await submit.click();
  await expect(
    page.getByText('Thanks for contacting us, we will get back to you shortly.')
  ).toBeVisible();
});
