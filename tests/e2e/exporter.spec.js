// tests/e2e/exporter/exporter.spec.js
//
// E2E tests specific to the "exporter" addon.
//
// The portal must be configured with the exporter tool in its config.json.
// The CI setup script (scripts/patch-addons-conf.js) handles addonsConf.json;
// for config.json you may need a fixture (see fixtures/config.exporter.json).

const { test, expect } = require("@playwright/test");
const {
    openPortal,
    clickTool,
    watchConsoleErrors,
    openMainMenu,
} = require("../../helpers/masterportal.js");

const TOOL_LABEL = "Exporter"; // visible label in the menu

test.describe("[exporter] Tool smoke-tests", () => {

    test("portal loads without errors when exporter addon is present", async ({
        page,
    }) => {
        const assertNoErrors = watchConsoleErrors(page);
        await openPortal(page);
        await assertNoErrors();
    });

    test("exporter tool opens correctly", async ({ page }) => {
        await openPortal(page);
        await openMainMenu(page);
        await clickTool(page, TOOL_LABEL);

        const toolPanel = page.locator("#exporter").first();
        await expect(toolPanel).toBeVisible({ timeout: 5000 });
    });

    // ── Extend with more specific tests ──────────────────────────────────────
    test("exporter can export a WFS layer as GeoJSON", async ({ page }) => {
        await openPortal(page);
        await openMainMenu(page);
        // make test wfs layer visible
        const layerButton = page.locator('button[title="Mobilfunkmasten (OSM)"]').first();

        await layerButton.click();
        // open exporter tool
        await clickTool(page, TOOL_LABEL);
        const exporterWfsLayer = page
            .locator('button[title="Mobilfunkmasten (OSM)"]')
            .first();

        if (
            await exporterWfsLayer
                .isVisible({ timeout: 5_000 })
                .catch(() => false)
        ) {
            await exporterWfsLayer.click();
        }
        // click on next
        const nextButton = page.locator('button[aria-label="Weiter"]').first();
        if (await nextButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await nextButton.click();
        }
        const geojsonButton = page.locator('button[title="geojson"]').first();
        if (
            await geojsonButton.isVisible({ timeout: 5_000 }).catch(() => false)
        ) {
            await geojsonButton.click();
        }

        const downloadPromise = page.waitForEvent("download");

        const finishButton = page
            .locator('button[aria-label="Abschließen"]')
            .first();
        if (
            await finishButton.isVisible({ timeout: 5_000 }).catch(() => false)
        ) {
            await finishButton.click();
        }

        const download = await downloadPromise;

    });
});
