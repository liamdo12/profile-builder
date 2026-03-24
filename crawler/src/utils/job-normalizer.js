/**
 * Normalizes raw scraped job data from any source into a common schema.
 * Ensures consistent field names, trims whitespace, and normalizes dates to ISO-8601.
 */

/**
 * Attempt to parse a date string into ISO-8601 format.
 * Returns null if parsing fails.
 * @param {string|null|undefined} raw
 * @returns {string|null}
 */
function normalizeDate(raw) {
  if (!raw) return null;

  // Already ISO-8601
  if (/^\d{4}-\d{2}-\d{2}T/.test(raw)) return raw;

  // Relative expressions like "3 days ago", "1 hour ago"
  const relativeMatch = raw.match(/(\d+)\s+(second|minute|hour|day|week|month)s?\s+ago/i);
  if (relativeMatch) {
    const amount = parseInt(relativeMatch[1], 10);
    const unit = relativeMatch[2].toLowerCase();
    const now = new Date();
    const unitMs = {
      second: 1000,
      minute: 60 * 1000,
      hour: 3600 * 1000,
      day: 86400 * 1000,
      week: 7 * 86400 * 1000,
      month: 30 * 86400 * 1000,
    };
    now.setTime(now.getTime() - amount * (unitMs[unit] || 0));
    return now.toISOString();
  }

  // Attempt generic Date parse
  const parsed = new Date(raw);
  if (!isNaN(parsed.getTime())) return parsed.toISOString();

  return null;
}

/**
 * Trim a string value, return null if empty/falsy.
 * @param {string|null|undefined} value
 * @returns {string|null}
 */
function clean(value) {
  if (!value) return null;
  const trimmed = String(value).trim().replace(/\s+/g, ' ');
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Normalize a raw scraped job object into the common job schema.
 * @param {object} raw - raw scraped fields (source-specific)
 * @param {string} sourceSite - e.g. "LINKEDIN", "INDEED", "GITHUB"
 * @returns {object} normalized job
 */
function normalizeJob(raw, sourceSite) {
  return {
    title: clean(raw.title) || 'Unknown Title',
    company: clean(raw.company) || 'Unknown Company',
    location: clean(raw.location) || null,
    salaryInfo: clean(raw.salaryInfo) || clean(raw.salary) || null,
    datePosted: normalizeDate(raw.datePosted || raw.date || raw.postedAt) || null,
    description: clean(raw.description) || null,
    sourceUrl: clean(raw.sourceUrl || raw.url || raw.link) || null,
    sourceSite,
  };
}

/**
 * Normalize an array of raw job objects, filtering out entries missing title and company.
 * @param {object[]} rawJobs
 * @param {string} sourceSite
 * @returns {object[]}
 */
function normalizeJobs(rawJobs, sourceSite) {
  if (!Array.isArray(rawJobs)) return [];
  return rawJobs
    .map((raw) => normalizeJob(raw, sourceSite))
    .filter((job) => job.title !== 'Unknown Title' || job.company !== 'Unknown Company');
}

module.exports = { normalizeJob, normalizeJobs, normalizeDate };
