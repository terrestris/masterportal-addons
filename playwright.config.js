// playwright.config.js
const { defineConfig, devices } = require("@playwright/test");

const ADDON_NAME = process.env.ADDON_NAME || "tourGuide";
if (!process.env.ADDON_NAME) {
  console.warn("ADDON_NAME environment variable not set, using default: exporter");
}
const BASE_URL = process.env.BASE_URL || "http://localhost:8080";

// Optional override for custom Chromium binary
const CHROMIUM_EXECUTABLE =
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined;

module.exports = defineConfig({
    testDir: "./test/e2e",
    testMatch: [
        "addon.spec.js",
        `**/${ADDON_NAME}.spec.js`,
    ],
    retries: process.env.CI ? 1 : 0,
    workers: 1,
    reporter: [
        ["list"],
        ["html", { outputFolder: "playwright-report", open: "never" }],
    ],
    use: {
        baseURL: BASE_URL,
        ignoreHTTPSErrors: true,
        actionTimeout: 5_000,
        navigationTimeout: 10_000,
        screenshot: "only-on-failure",
        trace: "on-first-retry",
    },
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                ...(CHROMIUM_EXECUTABLE
                    ? { executablePath: CHROMIUM_EXECUTABLE }
                    : {}),
                launchOptions: {
                    args: [
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        "--disable-dev-shm-usage",
                        "--disable-gpu",
                        "--ignore-certificate-errors",
                        "--ignore-ssl-errors",
                    ],
                },
            },
        },
    ],
});
