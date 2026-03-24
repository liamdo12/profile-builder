/**
 * GitHub job-listing repo scraper.
 * Fetches and parses README.md files from public GitHub repos that aggregate job listings.
 * Uses axios (no Playwright needed) since GitHub raw content has no bot-detection.
 */

const axios = require('axios');
const { normalizeJobs } = require('../utils/job-normalizer');
const { sleep } = require('../utils/request-throttle');
const config = require('../config');

/**
 * Parse negarprh/Canadian-Tech-Internships-2026 README.
 * Format: `| Company | Role | Location | Apply (badge link or Closed) | Date Posted |`
 * Handles `↳` rows (same company as previous row) and skips closed positions.
 * @param {string} markdown
 * @param {string} keyword - job title filter keyword
 * @returns {object[]}
 */
function parseCanadianTechInternships(markdown, keyword) {
  const jobs = [];
  const lines = markdown.split('\n');
  let lastCompany = null;
  const keywordLower = keyword ? keyword.toLowerCase() : null;

  for (const line of lines) {
    // Match table rows: | Company | Role | Location | Apply | Date |
    const match = line.match(
      /^\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|$/
    );
    if (!match) continue;

    const companyRaw = match[1].trim();
    const role = match[2].trim();
    const location = match[3].trim();
    const applyCell = match[4].trim();
    const datePosted = match[5].trim();

    // Skip header row and separator
    if (companyRaw === 'Company' || companyRaw.startsWith('---')) continue;

    // Skip closed positions
    if (applyCell.includes('Closed')) continue;

    // Handle ↳ (same company as previous row)
    const company = companyRaw === '↳' ? lastCompany : companyRaw;
    if (companyRaw !== '↳') lastCompany = company;

    // Filter by keyword if provided
    if (keywordLower &&
        !role.toLowerCase().includes(keywordLower) &&
        !company?.toLowerCase().includes(keywordLower) &&
        !location.toLowerCase().includes(keywordLower)) {
      continue;
    }

    // Extract apply URL from badge markdown: [![Apply](...)](URL)
    const urlMatch = applyCell.match(/\]\(([^)]+)\)\s*$/);
    const sourceUrl = urlMatch
      ? urlMatch[1]
      : `https://github.com/negarprh/Canadian-Tech-Internships-2026`;

    jobs.push({
      title: role,
      company: company || 'Unknown',
      location: location || 'Canada',
      sourceUrl,
      description: null,
      salaryInfo: null,
      datePosted: datePosted || null,
    });
  }

  return jobs;
}

/**
 * Known GitHub repos that aggregate remote/job listings in markdown format.
 * Each entry has a raw README URL and a parser strategy.
 */
const JOB_REPOS = [
  {
    name: 'remoteintech/remote-jobs',
    rawUrl: 'https://raw.githubusercontent.com/remoteintech/remote-jobs/main/README.md',
    parser: parseRemoteIntech,
  },
  {
    name: 'poteto/hiring-without-whiteboards',
    rawUrl: 'https://raw.githubusercontent.com/poteto/hiring-without-whiteboards/master/README.md',
    parser: parseHiringWithoutWhiteboards,
  },
  {
    name: 'negarprh/Canadian-Tech-Internships-2026',
    rawUrl: 'https://raw.githubusercontent.com/negarprh/Canadian-Tech-Internships-2026/main/README.md',
    parser: parseCanadianTechInternships,
  },
];

/**
 * Parse remoteintech/remote-jobs README.
 * Format: `| Company | Region | Info | ... |`
 * @param {string} markdown
 * @param {string} keyword - job title filter keyword
 * @returns {object[]}
 */
function parseRemoteIntech(markdown, keyword) {
  const jobs = [];
  const tableRowRegex = /^\|\s*\[([^\]]+)\]\(([^)]+)\)\s*\|([^|]*)\|([^|]*)\|/gm;
  let match;

  while ((match = tableRowRegex.exec(markdown)) !== null) {
    const company = match[1].trim();
    const url = match[2].trim();
    const region = match[3].trim();
    const description = match[4].trim();

    // Filter by keyword if provided
    if (keyword && !company.toLowerCase().includes(keyword.toLowerCase()) &&
        !description.toLowerCase().includes(keyword.toLowerCase())) {
      continue;
    }

    jobs.push({
      title: keyword || 'Remote Software Engineer',
      company,
      location: region || 'Remote',
      sourceUrl: url,
      description: description || null,
      salaryInfo: null,
      datePosted: null,
    });
  }

  return jobs;
}

/**
 * Parse poteto/hiring-without-whiteboards README.
 * Format: `- [Company](url) | Location | ...`
 * @param {string} markdown
 * @param {string} keyword - job title filter keyword
 * @returns {object[]}
 */
function parseHiringWithoutWhiteboards(markdown, keyword) {
  const jobs = [];
  // Match list items with linked company names
  const listItemRegex = /^[-*]\s+\[([^\]]+)\]\(([^)]+)\)(?:\s*\|\s*([^|\n]+))?(?:\s*\|\s*([^\n]+))?/gm;
  let match;

  while ((match = listItemRegex.exec(markdown)) !== null) {
    const company = match[1].trim();
    const url = match[2].trim();
    const location = match[3]?.trim() || 'Remote';
    const notes = match[4]?.trim() || null;

    if (keyword && !company.toLowerCase().includes(keyword.toLowerCase()) &&
        !notes?.toLowerCase().includes(keyword.toLowerCase())) {
      continue;
    }

    jobs.push({
      title: keyword || 'Software Engineer',
      company,
      location,
      sourceUrl: url,
      description: notes,
      salaryInfo: null,
      datePosted: null,
    });
  }

  return jobs;
}

/**
 * Fetch a GitHub raw README and parse job entries from it.
 * @param {object} repo - repo config { name, rawUrl, parser }
 * @param {string} keyword
 * @param {number} limit
 * @returns {Promise<object[]>}
 */
async function fetchAndParseRepo(repo, keyword, limit) {
  try {
    console.log(JSON.stringify({ level: 'info', msg: 'GitHub repo fetch', repo: repo.name }));
    const response = await axios.get(repo.rawUrl, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; profile-builder-crawler/1.0)',
        Accept: 'text/plain',
      },
    });

    const jobs = repo.parser(response.data, keyword);
    return jobs.slice(0, limit);
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', msg: 'GitHub repo fetch failed', repo: repo.name, error: err.message }));
    return [];
  }
}

/**
 * Scrape job listings from GitHub job-aggregator repos.
 * @param {object} params
 * @param {string} params.jobTitle - keyword used to filter entries
 * @param {number} params.maxResults
 * @returns {Promise<object[]>} normalized job array
 */
async function scrapeGitHub({ jobTitle, maxResults }) {
  const limit = maxResults || config.crawler.maxResultsPerSource;
  const perRepo = Math.ceil(limit / JOB_REPOS.length);
  const allRaw = [];

  for (const repo of JOB_REPOS) {
    const jobs = await fetchAndParseRepo(repo, jobTitle, perRepo);
    allRaw.push(...jobs);
    await sleep(500, 1000); // lighter delay since no browser
  }

  const trimmed = allRaw.slice(0, limit);
  return normalizeJobs(trimmed, 'GITHUB');
}

module.exports = { scrapeGitHub };
