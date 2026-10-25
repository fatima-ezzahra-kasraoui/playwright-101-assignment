import { defineConfig } from '@playwright/test';
import type { LtOptions } from './fixtures/lambdatest';
import 'dotenv/config';

export default defineConfig<LtOptions>({
  testDir: './tests',
  timeout: 120_000,
  fullyParallel: true,
  workers: 2,                       // projects + tests run in parallel
  reporter: [['list'], ['html', { open: 'never' }]],
  projects: [
    {
      name: 'Windows10-Chrome',
      use: { ltCaps: { browserName: 'Chrome', browserVersion: 'latest', platform: 'Windows 10' } },
    },
    {
      name: 'macOS-Catalina-Firefox',
      use: { ltCaps: { browserName: 'pw-firefox', browserVersion: 'latest', platform: 'macOS Catalina' } },
    },
  ],
});
