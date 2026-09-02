import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  use: {
    baseURL: 'http://localhost:3000',
    channel: 'chrome',
    headless: true,
  },
  webServer: [
    { command: 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: true, timeout: 120_000 },
    { command: 'npm run server', url: 'http://127.0.0.1:8000/health', reuseExistingServer: true, timeout: 120_000 },
  ],
});
