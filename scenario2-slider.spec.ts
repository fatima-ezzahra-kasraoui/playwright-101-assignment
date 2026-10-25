import { test, expect } from '../fixtures/lambdatest';

test('Scenario 2 - Drag & Drop Sliders', async ({ page }) => {
  await page.goto('https://www.testmuai.com/selenium-playground/');
  await page.getByRole('link', { name: 'Drag & Drop Sliders' }).click();

  const slider = page.locator('input[type="range"][value="15"]'); // "Default value 15"
  const output = page.locator('#rangeSuccess');
  await expect(output).toHaveText('15');

  const target = 95;
  const min = Number((await slider.getAttribute('min')) ?? 0);
  const max = Number((await slider.getAttribute('max')) ?? 100);
  const box = (await slider.boundingBox())!;

  // Real mouse drag to the proportional position of 95
  const y = box.y + box.height / 2;
  const startX = box.x + box.width * ((15 - min) / (max - min));
  const endX = box.x + box.width * ((target - min) / (max - min));
  await page.mouse.move(startX, y);
  await page.mouse.down();
  await page.mouse.move(endX, y, { steps: 20 });
  await page.mouse.up();

  // Fine-tune with the keyboard if the drag landed 1-2 units off
  await slider.focus();
  for (let i = 0; i < 10 && Number(await output.textContent()) !== target; i++) {
    const current = Number(await output.textContent());
    await page.keyboard.press(current < target ? 'ArrowRight' : 'ArrowLeft');
  }

  await expect(output).toHaveText('95');
});
