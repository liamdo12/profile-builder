/**
 * Indeed job search scraper.
 * Extracts job data from the _initialData JavaScript variable embedded in page scripts.
 * Handles Cloudflare challenge detection and reports gracefully.
 */

const { createBrowser, createContext, closeBrowser } = require('./base-scraper');
const { normalizeJobs } = require('../utils/job-normalizer');
const { sleep, backoff } = require('../utils/request-throttle');
const config = require('../config');

const INDEED_BASE = 'https://www.indeed.com';

/**
 * Build Indeed search URL.
 * @param {string} jobTitle
 * @param {string} location
 * @param {number} datePostedWithinDays
 * @returns {string}
 */
function buildSearchUrl(jobTitle, location, datePostedWithinDays) {
  const params = new URLSearchParams({
    q: jobTitle,
    l: location,
    fromage: String(datePostedWithinDays),
  });
  return `${INDEED_BASE}/jobs?${params.toString()}`;
}

/**
 * Detect if the current page is a Cloudflare or bot-detection challenge.
 * @param {import('playwright').Page} page
 * @returns {Promise<boolean>}
 */
async function isBlockedPage(page) {
  const title = await page.title().catch(() => '');
  const content = await page.content().catch(() => '');
  return (
    title.toLowerCase().includes('just a moment') ||
    title.toLowerCase().includes('attention required') ||
    content.includes('cf-browser-verification') ||
    content.includes('datadome') ||
    content.includes('_cf_chl_opt')
  );
}

/**
 * Extract job listings from Indeed's embedded _initialData JSON.
 * @param {import('playwright').Page} page
 * @returns {Promise<object[]>} raw job objects
 */
async function extractInitialData(page) {
  return page.evaluate(() => {
    // Indeed embeds job data in window._initialData or a script tag containing mosaic-provider-jobcards
    const scripts = Array.from(document.querySelectorAll('script'));
    let jobResults = [];

    for (const script of scripts) {
      const text = script.textContent || '';
      // Look for the mosaic job cards data structure
      if (text.includes('jobKeysWithInfo') || text.includes('jobCardShelfVM')) {
        try {
          // Extract JSON object from the script
          const match = text.match(/window\._initialData\s*=\s*(\{[\s\S]*?\});\s*(?:window|<\/script>)/);
          if (match) {
            const data = JSON.parse(match[1]);
            const jobCards = data?.jobKeysWithInfo || data?.mosaic?.mosaicProviderJobCardsModel?.results || [];
            jobResults = jobCards.map((job) => ({
              title: job.jobTitle || job.displayTitle || null,
              company: job.company || job.companyName || null,
              location: job.formattedLocation || job.location || null,
              salaryInfo: job.extractedSalary
                ? `${job.extractedSalary.min || ''}–${job.extractedSalary.max || ''} ${job.extractedSalary.type || ''}`
                : null,
              sourceUrl: job.jobkey ? `https://www.indeed.com/viewjob?jk=${job.jobkey}` : null,
              datePosted: job.pubDate || job.formattedRelativeTime || null,
              description: job.snippet || null,
            }));
            break;
          }
        } catch (_) {
          // Continue scanning other scripts
        }
      }

      // Fallback: parse newer mosaic JSON format embedded differently
      if (text.includes('"jobTitle"') && text.includes('"companyName"')) {
        try {
          const jsonMatch = text.match(/\{[^<]*"jobTitle"[^<]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.jobTitle) {
              jobResults.push({
                title: parsed.jobTitle,
                company: parsed.companyName || null,
                location: parsed.formattedLocation || null,
                salaryInfo: null,
                sourceUrl: null,
                datePosted: null,
                description: parsed.snippet || null,
              });
            }
          }
        } catch (_) {
          // Ignore parse errors
        }
      }
    }

    // If _initialData extraction failed, fall back to visible job cards DOM
    if (jobResults.length === 0) {
      const cards = Array.from(document.querySelectorAll('[data-jk], .job_seen_beacon, .tapItem'));
      jobResults = cards.map((card) => {
        const titleEl = card.querySelector('[data-testid="job-title"], h2.jobTitle a span, .jobTitle span');
        const companyEl = card.querySelector('[data-testid="company-name"], .companyName, span.companyName');
        const locationEl = card.querySelector('[data-testid="text-location"], .companyLocation');
        const salaryEl = card.querySelector('.estimated-salary, .salary-snippet-container');
        const linkEl = card.querySelector('a[href*="/rc/clk"], a[href*="viewjob"]');
        const dateEl = card.querySelector('[data-testid="myJobsStateDate"], .date');
        return {
          title: titleEl?.textContent?.trim() || null,
          company: companyEl?.textContent?.trim() || null,
          location: locationEl?.textContent?.trim() || null,
          salaryInfo: salaryEl?.textContent?.trim() || null,
          sourceUrl: linkEl ? `https://www.indeed.com${linkEl.getAttribute('href')}` : null,
          datePosted: dateEl?.textContent?.trim() || null,
          description: null,
        };
      }).filter((j) => j.title);
    }

    return jobResults;
  });
}

/**
 * Scrape Indeed job listings for the given parameters.
 * @param {object} params
 * @param {string} params.jobTitle
 * @param {string} params.location
 * @param {number} params.datePostedWithinDays
 * @param {number} params.maxResults
 * @returns {Promise<object[]>} normalized job array
 */
async function scrapeIndeed({ jobTitle, location, datePostedWithinDays, maxResults }) {
  const limit = maxResults || config.crawler.maxResultsPerSource;
  let browser = null;

  try {
    browser = await createBrowser();
    const context = await createContext(browser);
    const page = await context.newPage();
    page.setDefaultTimeout(30000);

    const url = buildSearchUrl(jobTitle, location, datePostedWithinDays);
    let attempt = 0;
    let rawJobs = [];

    while (attempt <= config.crawler.maxRetries) {
      try {
        console.log(JSON.stringify({ level: 'info', msg: 'Indeed fetch', url, attempt }));
        await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });

        if (await isBlockedPage(page)) {
          if (attempt >= config.crawler.maxRetries) {
            throw new Error('Indeed blocked by Cloudflare/bot-detection after max retries');
          }
          console.log(JSON.stringify({ level: 'warn', msg: 'Indeed bot-detection triggered', attempt }));
          await backoff(attempt);
          attempt++;
          continue;
        }

        rawJobs = await extractInitialData(page);
        break;
      } catch (err) {
        if (attempt >= config.crawler.maxRetries) throw err;
        console.log(JSON.stringify({ level: 'warn', msg: 'Indeed retry', error: err.message, attempt }));
        await backoff(attempt);
        attempt++;
      }
    }

    await sleep();

    const trimmed = rawJobs.slice(0, limit);
    return normalizeJobs(trimmed, 'INDEED');
  } finally {
    await closeBrowser(browser);
  }
}

module.exports = { scrapeIndeed };
