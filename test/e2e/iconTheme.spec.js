// tests/e2e/iconTheme/iconTheme.spec.js
//
// E2E tests specific to the "iconTheme" addon.

const { test, expect } = require("@playwright/test");
const {
    openPortal,
    clickTool,
    watchConsoleErrors,
    openMainMenu,
} = require("../../helpers/masterportal.js");

test.describe("[iconTheme] Tool smoke-tests", () => {

    test("portal loads without errors when iconTheme addon is present", async ({
        page,
    }) => {
        const assertNoErrors = watchConsoleErrors(page);
        await openPortal(page);
        await assertNoErrors();
    });

    test("iconTheme tool opens correctly", async ({ page }) => {
        await openPortal(page);
        await openMainMenu(page);
        // make test wfs layer visible
        const layerButton = page.locator('button[title="Bonn Stadtgebiet"]').first();

        await layerButton.click();
        // perform a GetFeatureInfo click on the map
        // click roughly in the center of the map viewport to trigger feature info
        // use Playwright mouse to click the center of the current viewport
        const vp = page.viewportSize();
        if (vp) {
            await page.mouse.click(Math.floor(vp.width / 2), Math.floor(vp.height / 2));
        } else {
            const { width, height } = await page.evaluate(() => ({
                width: window.innerWidth,
                height: window.innerHeight,
            }));
            await page.mouse.click(Math.floor(width / 2), Math.floor(height / 2));
        }
        // then wait for GetFeatureInfo popup to appear
        await page.waitForSelector('div.gfi', { state: 'visible' });

        // wait for the feature info table and assert first td contains an img
        await page.waitForSelector('table.table');
        const imgClassOk = await page.evaluate(() => {
            const table = document.querySelector('table.table');
            if (!table) return false;
            const firstTd = table.querySelector('td');
            if (!firstTd) return false;
            const img = firstTd.querySelector('img');
            if (!img) return false;
            return img.classList.contains('gfi-theme-icon');
        });
        await expect(imgClassOk).toBe(true);
    });

});
