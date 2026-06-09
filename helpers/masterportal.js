// tests/e2e/helpers/masterportal.js
//
// Reusable helpers for Masterportal E2E tests.
// Import these in your addon-specific spec files.

const { expect } = require("@playwright/test");

// ── Constants ────────────────────────────────────────────────────────────────

/** Portal path that has a minimal config and is always available */
const PORTAL_PATH = "/e2e?&CONFIGJS=e2e/config.js";

// ── Page helpers ─────────────────────────────────────────────────────────────

/**
 * Navigate to the Masterportal basic portal and wait until the master container
 * is visible (= the application has fully bootstrapped).
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} [portalPath] - override the default portal path
 */
async function openPortal(page, portalPath = PORTAL_PATH) {
    await page.goto(portalPath);
    await page.waitForSelector("#masterportal-container");
    await page.waitForSelector("#mainMenu-toggle-button");
}

/**
 * Open the main menu
 * The selector targets the Bootstrap nav-toggle that opens the sidebar.
 *
 * @param {import('@playwright/test').Page} page
 */
async function openMainMenu(page) {
    const menuButton = page.locator("#mainMenu-toggle-button").first();

    if (await menuButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await menuButton.click();
    }
    // Give the sidebar animation time to finish
    await page.waitForTimeout(500);
}

/**
 * Click a named tool in the Masterportal menu sidebar.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} toolName - visible label of the tool / addon
 */
async function clickTool(page, toolName) {
    const toolButton = page.locator(`button[aria-label="${toolName}"]`).first();

    await expect(toolButton).toBeVisible({ timeout: 500 });
    await toolButton.click();
}

/**
 * Assert that the Masterportal page loaded without a JS crash.
 * Checks the console for uncaught errors during a short observation window.
 *
 * Usage:
 *   const assertNoErrors = watchConsoleErrors(page);
 *   // … interact with the page …
 *   await assertNoErrors();
 *
 * @param {import('@playwright/test').Page} page
 * @returns {() => Promise<void>} call this at the end of the test
 */
function watchConsoleErrors(page) {
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
    });
    return async () => {
        // Filter noise from known third-party / map-tile 404s
        const real = errors.filter(
            (e) =>
                !e.includes("net::ERR_") && // network errors (tiles etc.)
                !e.includes("favicon") &&
                !e.includes("ResizeObserver"),
        );
        expect(
            real,
            `Unexpected console errors:\n${real.join("\n")}`,
        ).toHaveLength(0);
    };
}

/**
 * Wait for the Vue application to finish mounting (looks for the root app node).
 *
 * @param {import('@playwright/test').Page} page
 */
async function waitForVueApp(page) {
    await page.waitForFunction(
        () => {
            const root = document.querySelector("#masterportal-root");
            return root && root.__vue_app__;
        },
        { timeout: 5000 },
    );
}

// ── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
    PORTAL_PATH,
    openPortal,
    openMainMenu,
    clickTool,
    watchConsoleErrors,
    waitForVueApp,
};
