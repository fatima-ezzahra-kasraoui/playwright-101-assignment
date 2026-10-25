import { test as base, chromium } from '@playwright/test';
import 'dotenv/config';

export type LtCaps = {
  browserName: string;      // "Chrome" | "pw-firefox" | "pw-webkit" | "MicrosoftEdge" ...
  browserVersion: string;
  platform: string;         // "Windows 10" | "macOS Catalina" ...
};

export type LtOptions = { ltCaps: LtCaps };

export const test = base.extend<LtOptions>({
  ltCaps: [
    { browserName: 'Chrome', browserVersion: 'latest', platform: 'Windows 10' },
    { option: true },
  ],

  // Override the built-in `page` fixture: the browser runs on TestMu AI, not locally.
  page: async ({ ltCaps }, use, testInfo) => {
    const capabilities = {
      browserName: ltCaps.browserName,
      browserVersion: ltCaps.browserVersion,
      'LT:Options': {
        platform: ltCaps.platform,
        build: 'Playwright 101 Assignment',
        name: testInfo.title,
        user: process.env.LT_USERNAME,
        accessKey: process.env.LT_ACCESS_KEY,
        // Required by the assignment:
        network: true,   // network logs
        video: true,     // video recording
        console: true,   // console logs
        visual: true,    // screenshots (step-by-step)
        tunnel: false,
      },
    };

    const wsEndpoint =
      'wss://cdp.lambdatest.com/playwright?capabilities=' +
      encodeURIComponent(JSON.stringify(capabilities));

    const browser = await chromium.connect({ wsEndpoint, timeout: 120_000 });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    await use(page);

    // Report pass/fail to the TestMu AI dashboard
    const passed = testInfo.status === testInfo.expectedStatus;
    await page.evaluate(
      () => {},
      `lambdatest_action: ${JSON.stringify({
        action: 'setTestStatus',
        arguments: { status: passed ? 'passed' : 'failed', remark: testInfo.error?.message ?? 'OK' },
      })}`
    );
    await context.close();
    await browser.close();
  },
});

export { expect } from '@playwright/test';
