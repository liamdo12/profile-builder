/**
 * Playwright-extra stealth plugin configuration.
 * Patches browser fingerprints to evade common bot-detection heuristics.
 */

const { chromium } = require('playwright-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Apply stealth plugin with all evasion modules enabled
chromium.use(StealthPlugin());

module.exports = { chromium };
