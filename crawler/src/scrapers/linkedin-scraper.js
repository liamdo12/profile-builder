/**
 * LinkedIn guest job search scraper.
 * Uses the public /jobs-guest API endpoint (no login required).
 * Parses HTML job cards returned by the API.
 */

const { createBrowser, createContext, closeBrowser } = require('./base-scraper');
const { normalizeJobs } = require('../utils/job-normalizer');
const { sleep, backoff } = require('../utils/request-throttle');
const config = require('../config');

const BASE_URL = 'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search';

/**
 * Build LinkedIn guest search URL.
 * @param {string} jobTitle
 * @param {string} location
 * @param {number} datePostedWithinDays
 * @param {number} start - pagination offset
 * @returns {string}
 */
function buildSearchUrl(jobTitle, location, datePostedWithinDays, start = 0) {
  const seconds = datePostedWithinDays * 24 * 3600;
  const params = new URLSearchParams({
    keywords: jobTitle,
    location,
    f_TPR: `r${seconds}`,
    start: String(start),
  });
  return `${BASE_URL}?${params.toString()}`;
}

/**
 * Parse job cards from LinkedIn guest API HTML response.
 * @param {import('playwright').Page} page
 * @returns {Promise<object[]>} raw job objects
 */
async function parseJobCards(page) {
  return page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('li'));
    return cards.map((card) => {
      const titleEl = card.querySelector('.base-search-card__title, h3.base-search-card__title');
      const companyEl = card.querySelector('.base-search-card__subtitle, h4.base-search-card__subtitle');
      const locationEl = card.querySelector('.job-search-card__location');
      const linkEl = card.querySelector('a.base-card__full-link, a[href*="/jobs/view/"]');
      const dateEl = card.querySelector('time');
      const salaryEl = card.querySelector('.job-search-card__salary-info');

      return {
        title: titleEl?.textContent?.trim() || null,
        company: companyEl?.textContent?.trim() || null,
        location: locationEl?.textContent?.trim() || null,
        sourceUrl: linkEl?.href || null,
        datePosted: dateEl?.getAttribute('datetime') || dateEl?.textContent?.trim() || null,
        salaryInfo: salaryEl?.textContent?.trim() || null,
        description: null, // enriched separately if needed
      };
    }).filter((j) => j.title && j.company);
  });
}

/**
 * Scrape LinkedIn job listings for the given parameters.
 * @param {object} params
 * @param {string} params.jobTitle
 * @param {string} params.location
 * @param {number} params.datePostedWithinDays
 * @param {number} params.maxResults
 * @returns {Promise<object[]>} normalized job array
 */
async function scrapeLinkedIn({ jobTitle, location, datePostedWithinDays, maxResults }) {
  const limit = maxResults || config.crawler.maxResultsPerSource;
  let browser = null;

  try {
    browser = await createBrowser();
    const context = await createContext(browser);
    const page = await context.newPage();

    // Set a realistic request timeout
    page.setDefaultTimeout(30000);

    const url = buildSearchUrl(jobTitle, location, datePostedWithinDays);
    let attempt = 0;
    let rawJobs = [];

    while (attempt <= config.crawler.maxRetries) {
      try {
        console.log(JSON.stringify({ level: 'info', msg: 'LinkedIn fetch', url, attempt }));
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        if (response && response.status() === 429) {
          console.log(JSON.stringify({ level: 'warn', msg: 'LinkedIn 429 rate limit', attempt }));
          if (attempt >= config.crawler.maxRetries) {
            throw new Error('LinkedIn rate limited after max retries (429)');
          }
          await backoff(attempt);
          attempt++;
          continue;
        }

        if (response && response.status() >= 400) {
          throw new Error(`LinkedIn returned HTTP ${response.status()}`);
        }

        rawJobs = await parseJobCards(page);
        break;
      } catch (err) {
        if (attempt >= config.crawler.maxRetries) throw err;
        console.log(JSON.stringify({ level: 'warn', msg: 'LinkedIn retry', error: err.message, attempt }));
        await backoff(attempt);
        attempt++;
      }
    }

    // Throttle before returning
    await sleep();

    const trimmed = rawJobs.slice(0, limit);
    return normalizeJobs(trimmed, 'LINKEDIN');
  } finally {
    await closeBrowser(browser);
  }
}

module.exports = { scrapeLinkedIn };
