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

const { test, expect } = require("@playwright/test");
const {
    openPortal,
    waitForVueApp,
    watchConsoleErrors,
} = require("../../helpers/masterportal");

const ADDON_NAME = process.env.ADDON_NAME || "tourGuide";

test.skip(
    // TODO: Add test for type gfiTheme
    ADDON_NAME === "simpleLineChart"
);

test.describe(`[${ADDON_NAME}] Generic smoke-tests`, () => {
    test("portal loads and map canvas is rendered", async ({ page }) => {
        await openPortal(page);

        // The OpenLayers canvas must be present
        await expect(
            page.locator(".ol-unselectable>.ol-layer>canvas").first(),
        ).toBeVisible({ timeout: 1000 });
    });

    test("Vue application mounts without errors", async ({ page }) => {
        await openPortal(page);
        await waitForVueApp(page);
        await watchConsoleErrors(page);

        // Check for "error" in console messages
        const consoleErrors = await page.evaluate(() => {
            return (
                window.__consoleMessages?.filter((msg) =>
                    msg.toLowerCase().includes("error"),
                ) || []
            );
        });
        await expect(consoleErrors).toHaveLength(0);
    });

    test(`addon "${ADDON_NAME}" is registered in the Vuex modules tree`, async ({
        page,
    }) => {
        await openPortal(page);
        await waitForVueApp(page);

        const addonRegistered = await page.evaluate((addonName) => {
            const root = document.querySelector("#masterportal-root");
            if (!root || !root.__vue_app__) return false;
            const store = root.__vue_app__.config.globalProperties.$store;
            if (!store) return false;
            const state = store.state;
            const modules = state.Modules || {};
            const addons = state.Addons || {};

            // Case-insensitive key look-up
            const key = addonName.toLowerCase();
            return Object.keys({ ...state, ...modules, ...addons }).some(
                (k) => k.toLowerCase() === key,
            );
        }, ADDON_NAME);

        expect(addonRegistered).toBeTruthy();
    });
});
