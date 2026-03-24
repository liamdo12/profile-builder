/**
 * Base scraper: launches a stealth Playwright Chromium browser and provides
 * helpers for creating browser contexts with randomized fingerprints.
 */

const { chromium } = require('../utils/stealth-config');
const { getRandomUserAgent, getRandomViewport } = require('../utils/user-agent-rotation');
const config = require('../config');

/**
 * Launch a stealth Chromium browser instance.
 * @returns {Promise<import('playwright').Browser>}
 */
async function createBrowser() {
  const launchOptions = {
    headless: config.playwright.headless,
    slowMo: config.playwright.slowMo,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-blink-features=AutomationControlled',
    ],
  };

  if (config.crawler.proxyUrl) {
    launchOptions.proxy = { server: config.crawler.proxyUrl };
  }

  const browser = await chromium.launch(launchOptions);
  return browser;
}

/**
 * Create a new browser context with randomized viewport and user-agent.
 * @param {import('playwright').Browser} browser
 * @returns {Promise<import('playwright').BrowserContext>}
 */
async function createContext(browser) {
  const userAgent = getRandomUserAgent();
  const viewport = getRandomViewport();

  const context = await browser.newContext({
    userAgent,
    viewport,
    locale: 'en-US',
    timezoneId: 'America/New_York',
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
    },
    // Prevent navigator.webdriver from being true
    javaScriptEnabled: true,
  });

  // Patch navigator.webdriver to undefined on every new page
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  return context;
}

/**
 * Safely close a browser instance, ignoring errors.
 * @param {import('playwright').Browser} browser
 */
async function closeBrowser(browser) {
  try {
    if (browser && browser.isConnected()) {
      await browser.close();
    }
  } catch (err) {
    console.error(JSON.stringify({ level: 'warn', msg: 'Error closing browser', error: err.message }));
  }
}

module.exports = { createBrowser, createContext, closeBrowser };
