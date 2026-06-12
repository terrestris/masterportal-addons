// tests/e2e/tourGuide/tourGuide.spec.js
//
// E2E tests specific to the "tourGuide" addon.

const { test, expect } = require("@playwright/test");
const {
    openPortal,
    clickTool,
    watchConsoleErrors,
    openMainMenu,
} = require("../../helpers/masterportal.js");

const TOOL_LABEL = 'Tour';

test.describe("[tourGuide] Tool smoke-tests", () => {

    test("portal loads without errors when tourGuide addon is present", async ({
        page,
    }) => {
        const assertNoErrors = watchConsoleErrors(page);
        await openPortal(page);
        await assertNoErrors();
    });

    test("tourGuide tool opens correctly", async ({ page }) => {
        await openPortal(page);
        await openMainMenu(page);
        await clickTool(page, TOOL_LABEL);

        const toolElement = page.locator(".introjs-tooltip");
        await expect(toolElement).toBeVisible({ timeout: 5000 });
    });

});
