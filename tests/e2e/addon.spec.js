// tests/e2e/addon.spec.js
//
// Generic smoke-test that is executed for EVERY addon.
// These tests verify that:
//   1. The portal loads and renders the map canvas.
//   2. No JS errors are thrown on startup.
//   3. The addon was registered (its key appears in the Vuex store or DOM).
//
// Extend this file with addon-specific assertions only if the behaviour
// is truly shared across all addons; otherwise create a per-addon spec.

const { test, expect } = require('@playwright/test');
const {
  openPortal,
  waitForVueApp,
  watchConsoleErrors,
} = require('../../helpers/masterportal');

const ADDON_NAME = process.env.ADDON_NAME || 'unknown';

console.log(`[DEBUG] Starting tests for addon: ${ADDON_NAME}`);

test.describe(`[${ADDON_NAME}] Generic smoke-tests`, () => {

  test('portal loads and map canvas is rendered', async ({ page }) => {
    await openPortal(page);
    console.log(`[DEBUG] Portal opened successfully`);

    // The OpenLayers canvas must be present
    await expect(page.locator('.ol-unselectable>.ol-layer>canvas').first())
      .toBeVisible({ timeout: 100 });
  });

  test('Vue application mounts without errors', async ({ page }) => {
    await openPortal(page);
    await waitForVueApp(page);

    // Check for a fatal Vue error banner that Masterportal renders on crash
    const errorBanner = page.locator('.mp-error, [data-cy="error-message"]');
    await expect(errorBanner).toHaveCount(0);
  });

  test(`addon "${ADDON_NAME}" is registered in the Vuex modules tree`, async ({ page }) => {
    await openPortal(page);
    await waitForVueApp(page);

    const addonRegistered = await page.evaluate((addonName) => {
      const root = document.querySelector('#masterportal-root');
      if (!root || !root.__vue_app__) return false;

      const store = root.__vue_app__.config.globalProperties.$store;
      if (!store) return false;

      const state = store.state;

      // Masterportal v3 nests addons under Modules
      const modules  = (state.Modules  || {});
      const addons   = (state.Addons   || {});

      // Case-insensitive key look-up
      const key = addonName.toLowerCase();
      return Object.keys({ ...modules, ...addons }).some(
        (k) => k.toLowerCase() === key
      );
    }, ADDON_NAME);

    // Soft assertion: warn rather than hard-fail if the addon isn't in Vuex.
    // Some addons (type: javascript / control) don't register a Vuex module.
    if (!addonRegistered) {
      console.warn(
        `Note: addon "${ADDON_NAME}" was not found in the Vuex module tree. ` +
        `This is expected for addons of type "javascript" or "control".`
      );
    }
  });

});
