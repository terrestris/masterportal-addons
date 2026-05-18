// playwright.config.js
// Placed at the root of the masterportal-addons repo.
//
// The BASE_URL and ADDON_NAME env-vars are set by the CI workflow;
// they can also be set locally:
//   ADDON_NAME=exporter BASE_URL=https://localhost:9001 npx playwright test

const { defineConfig, devices } = require('@playwright/test');

const BASE_URL   = process.env.BASE_URL   || 'https://localhost:9001';
const ADDON_NAME = process.env.ADDON_NAME || 'exporter';

module.exports = defineConfig({
  // Set to repo root so that relative requires from nested spec files resolve
  // correctly against <repo-root>/helpers/masterportal.js.
  testDir: '.',

  // Only collect actual spec files – never the helper modules.
  testMatch: ADDON_NAME
    ? ['tests/e2e/addon.spec.js', `tests/e2e/${ADDON_NAME}.spec.js`]
    : ['tests/e2e/addon.spec.js', 'tests/e2e/**/*.spec.js'],

  // Retry once on CI to reduce flakiness
  retries: process.env.CI ? 1 : 0,

  // Run tests sequentially per addon (the dev server is shared)
  workers: 1,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: BASE_URL,

    // Accept the Masterportal self-signed certificate at the Playwright level
    ignoreHTTPSErrors: true,

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
        ignoreHTTPSErrors: true,
        // Pass the flag directly to the Chromium binary so headless mode
        // also skips the self-signed certificate error screen.
        // Without this, headless Chromium may show "Your connection is not
        // private" and never load the page despite ignoreHTTPSErrors.
        launchOptions: {
          args: ['--ignore-certificate-errors'],
        },
      },
    },
  ],
});
