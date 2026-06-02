// playwright.config.js
const { defineConfig, devices } = require("@playwright/test");

const BASE_URL = process.env.BASE_URL || "https://localhost:8443";

// Optional override for custom Chromium binary
const CHROMIUM_EXECUTABLE =
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined;

module.exports = defineConfig({
    testDir: ".",
    testMatch: ["tests/e2e/*.spec.js"],
    retries: process.env.CI ? 1 : 0,
    workers: 1,
    reporter: [
        ["list"],
        ["html", { outputFolder: "playwright-report", open: "never" }],
    ],
    use: {
        baseURL: BASE_URL,
        ignoreHTTPSErrors: true,
        actionTimeout: 15_000,
        navigationTimeout: 60_000,
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
