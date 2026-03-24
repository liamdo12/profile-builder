/**
 * Throttling utilities: random delay with jitter and exponential backoff.
 * Used between page navigations to mimic human browsing patterns.
 */

const config = require('../config');

/**
 * Sleep for a random duration between minMs and maxMs.
 * @param {number} [minMs]
 * @param {number} [maxMs]
 * @returns {Promise<void>}
 */
async function sleep(minMs, maxMs) {
  const min = minMs ?? config.crawler.minDelayMs;
  const max = maxMs ?? config.crawler.maxDelayMs;
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Calculate exponential backoff delay for a given attempt number.
 * Base delay doubles each attempt with added jitter.
 * @param {number} attempt - 0-indexed attempt number
 * @param {number} [baseMs=2000] - base delay in ms
 * @returns {number} delay in ms
 */
function getBackoffDelay(attempt, baseMs = 2000) {
  const exponential = baseMs * Math.pow(2, attempt);
  const jitter = Math.floor(Math.random() * 1000);
  return Math.min(exponential + jitter, 30000); // cap at 30s
}

/**
 * Sleep for exponential backoff duration.
 * @param {number} attempt - 0-indexed attempt number
 * @returns {Promise<void>}
 */
async function backoff(attempt) {
  const delay = getBackoffDelay(attempt);
  console.log(JSON.stringify({ level: 'info', msg: `Backoff delay ${delay}ms`, attempt }));
  return new Promise((resolve) => setTimeout(resolve, delay));
}

module.exports = { sleep, backoff, getBackoffDelay };
