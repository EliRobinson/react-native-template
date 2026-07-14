import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/web',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:8081',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm dev:web',
    url: 'http://localhost:8081',
    reuseExistingServer: !process.env.CI,
  },
});
