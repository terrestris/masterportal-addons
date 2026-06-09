// tests/e2e/importer/importer.spec.js
//
// E2E tests specific to the "importer" addon.

const { test, expect } = require("@playwright/test");
const {
    openPortal,
    clickTool,
    watchConsoleErrors,
    openMainMenu,
} = require("../../helpers/masterportal.js");

const TOOL_LABEL = 'Importer';

test.describe("[importer] Tool smoke-tests", () => {

    test("portal loads without errors when importer addon is present", async ({
        page,
    }) => {
        const assertNoErrors = watchConsoleErrors(page);
        await openPortal(page);
        await assertNoErrors();
    });

    test("importer tool opens correctly", async ({ page }) => {
        await openPortal(page);
        await openMainMenu(page);
        await clickTool(page, TOOL_LABEL);

        const toolPanel = page.locator("#importer").first();
        await expect(toolPanel).toBeVisible({ timeout: 5000 });
    });

    // ── Extend with more specific tests ──────────────────────────────────────
    test("importer can import a WMS layer", async ({ page }) => {
        const layerName = "OpenStreetMap WMS - by terrestris";
        const url = "https://ows.terrestris.de/osm/service?service=wms&request=GetCapabilities";

        await openPortal(page);
        await openMainMenu(page);
        // open importer tool
        await clickTool(page, TOOL_LABEL);
        // click on next
        const nextButton = page.locator('button[aria-label="Weiter"]').first();
        if (await nextButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await nextButton.click();
        }

        await page.getByRole('textbox', { name: 'Capabilities URL' }).click();
        await page.getByRole('textbox', { name: 'Capabilities URL' }).fill(url);
        await page.getByRole('button', { name: 'Weiter' }).click();
        await page.waitForSelector(".importer-addon-layer-selection");
        await page.getByRole('checkbox', { name: layerName }).check();
        await page.getByRole('button', { name: 'Abschließen' }).click();
        await page.getByRole('button', { name: 'Close' }).click();

        await expect(
            page.locator('#layer-tree').getByText(layerName)
        ).toBeVisible();

    });
});
