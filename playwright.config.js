// playwright.config.js

const { defineConfig, devices } = require('@playwright/test');

const BASE_URL   = process.env.BASE_URL   || 'http://localhost:8080';
const ADDON_NAME = process.env.ADDON_NAME || '';

// On Alpine CI the system Chromium is used (set by the workflow).
// Locally falls back to Playwright's own downloaded Chromium.
const CHROMIUM_EXECUTABLE = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined;

module.exports = defineConfig({
  testDir: '.',
  testMatch: ADDON_NAME
    ? ['tests/e2e/addon.spec.js', `tests/e2e/${ADDON_NAME}/*.spec.js`]
    : ['tests/e2e/addon.spec.js', 'tests/e2e/**/*.spec.js'],

  retries: process.env.CI ? 1 : 0,
  workers: 1,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: BASE_URL,
    actionTimeout:     15_000,
    navigationTimeout: 60_000,
    screenshot: 'only-on-failure',
    trace:      'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(CHROMIUM_EXECUTABLE ? { executablePath: CHROMIUM_EXECUTABLE } : {}),
        launchOptions: {
          args: [
            // Required inside Docker / Alpine containers
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
          ],
        },
      },
    },
  ],
});
