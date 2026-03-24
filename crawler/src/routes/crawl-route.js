/**
 * Crawl route: POST /crawl
 * Validates request body, dispatches scrapers in parallel via Promise.allSettled,
 * aggregates results and errors into a unified response.
 */

const { Router } = require('express');
const { scrapeLinkedIn } = require('../scrapers/linkedin-scraper');
const { scrapeIndeed } = require('../scrapers/indeed-scraper');
const { scrapeGitHub } = require('../scrapers/github-repo-scraper');
const config = require('../config');

const router = Router();

const VALID_SOURCES = ['LINKEDIN', 'INDEED', 'GITHUB'];

/**
 * Validate POST /crawl request body.
 * Returns an error message string or null if valid.
 * @param {object} body
 * @returns {string|null}
 */
function validateBody(body) {
  if (!body.jobTitle || typeof body.jobTitle !== 'string') {
    return 'jobTitle is required and must be a string';
  }
  if (body.sources !== undefined) {
    if (!Array.isArray(body.sources) || body.sources.length === 0) {
      return 'sources must be a non-empty array';
    }
    const invalid = body.sources.filter((s) => !VALID_SOURCES.includes(s));
    if (invalid.length > 0) {
      return `Invalid sources: ${invalid.join(', ')}. Valid: ${VALID_SOURCES.join(', ')}`;
    }
  }
  if (body.maxResultsPerSource !== undefined) {
    const n = Number(body.maxResultsPerSource);
    if (!Number.isInteger(n) || n < 1 || n > 50) {
      return 'maxResultsPerSource must be an integer between 1 and 50';
    }
  }
  if (body.datePostedWithinDays !== undefined) {
    const n = Number(body.datePostedWithinDays);
    if (!Number.isInteger(n) || n < 1 || n > 30) {
      return 'datePostedWithinDays must be an integer between 1 and 30';
    }
  }
  return null;
}

/**
 * Map source name to scraper function.
 * @param {string} source
 * @param {object} params
 * @returns {Promise<object[]>}
 */
function runScraper(source, params) {
  switch (source) {
    case 'LINKEDIN': return scrapeLinkedIn(params);
    case 'INDEED':   return scrapeIndeed(params);
    case 'GITHUB':   return scrapeGitHub(params);
    default:         return Promise.reject(new Error(`Unknown source: ${source}`));
  }
}

router.post('/', async (req, res, next) => {
  const startMs = Date.now();

  const validationError = validateBody(req.body);
  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }

  const {
    jobTitle,
    location = '',
    datePostedWithinDays = 7,
    sources = VALID_SOURCES,
    maxResultsPerSource = config.crawler.maxResultsPerSource,
  } = req.body;

  const scraperParams = {
    jobTitle,
    location,
    datePostedWithinDays: Number(datePostedWithinDays),
    maxResults: Number(maxResultsPerSource),
  };

  console.log(JSON.stringify({
    level: 'info',
    msg: 'Crawl request started',
    jobTitle,
    location,
    sources,
    maxResultsPerSource,
  }));

  // Run all requested scrapers in parallel; collect both results and errors
  const settled = await Promise.allSettled(
    sources.map((source) => runScraper(source, scraperParams))
  );

  const jobs = [];
  const errors = [];
  const metadata = { duration_ms: 0 };

  settled.forEach((result, idx) => {
    const source = sources[idx];
    const countKey = `${source.toLowerCase()}_count`;

    if (result.status === 'fulfilled') {
      const sourceJobs = result.value || [];
      jobs.push(...sourceJobs);
      metadata[countKey] = sourceJobs.length;
    } else {
      console.error(JSON.stringify({
        level: 'error',
        msg: 'Scraper failed',
        source,
        error: result.reason?.message,
      }));
      errors.push({
        source,
        message: result.reason?.message || 'Unknown error',
        retryable: !result.reason?.message?.includes('max retries'),
      });
      metadata[countKey] = 0;
    }
  });

  metadata.duration_ms = Date.now() - startMs;

  console.log(JSON.stringify({
    level: 'info',
    msg: 'Crawl request complete',
    total_jobs: jobs.length,
    errors: errors.length,
    duration_ms: metadata.duration_ms,
  }));

  return res.json({ success: true, jobs, errors, metadata });
});

module.exports = router;
