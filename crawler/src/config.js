require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  crawler: {
    maxResultsPerSource: parseInt(process.env.MAX_RESULTS_PER_SOURCE || '20', 10),
    requestTimeoutMs: parseInt(process.env.REQUEST_TIMEOUT_MS || '120000', 10),
    minDelayMs: parseInt(process.env.MIN_DELAY_MS || '1000', 10),
    maxDelayMs: parseInt(process.env.MAX_DELAY_MS || '3000', 10),
    maxRetries: parseInt(process.env.MAX_RETRIES || '3', 10),
    proxyUrl: process.env.PROXY_URL || null,
  },

  playwright: {
    headless: process.env.PLAYWRIGHT_HEADLESS !== 'false',
    slowMo: parseInt(process.env.PLAYWRIGHT_SLOW_MO || '0', 10),
  },
};
