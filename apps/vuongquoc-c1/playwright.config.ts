import { defineConfig } from '@playwright/test';

const host = '127.0.0.1';
const port = 3210;
const baseURL = `http://${host}:${port}`;

export default defineConfig({
  testDir: './tests/e2e',
  forbidOnly: !!process.env.CI,
  use: { baseURL, browserName: 'chromium', trace: 'retain-on-failure' },
  webServer: {
    command: `npm run start -- --hostname ${host} --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
  },
});
