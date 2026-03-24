/**
 * Express server entry point for the job crawler microservice.
 * Listens on PORT (default 3001). Mounts /crawl and /health routes.
 * Handles graceful shutdown on SIGTERM for ECS Fargate deployments.
 */

const express = require('express');
const config = require('./config');
const crawlRouter = require('./routes/crawl-route');
const healthRouter = require('./routes/health-route');
const { errorHandler } = require('./middleware/error-handler');

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));

// Structured request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(JSON.stringify({
      level: 'info',
      msg: 'HTTP request',
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration_ms: Date.now() - start,
    }));
  });
  next();
});

// ── Routes ────────────────────────────────────────────────────
app.use('/health', healthRouter);
app.use('/crawl', crawlRouter);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// Error handler must be last
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────
const server = app.listen(config.port, () => {
  console.log(JSON.stringify({
    level: 'info',
    msg: 'Crawler service started',
    port: config.port,
    env: config.nodeEnv,
  }));
});

// Set server-level timeout slightly above the crawl timeout
server.timeout = config.crawler.requestTimeoutMs + 10000;

// ── Graceful shutdown ─────────────────────────────────────────
function shutdown(signal) {
  console.log(JSON.stringify({ level: 'info', msg: `${signal} received, shutting down` }));
  server.close(() => {
    console.log(JSON.stringify({ level: 'info', msg: 'Server closed' }));
    process.exit(0);
  });

  // Force exit if server doesn't close within 15s
  setTimeout(() => {
    console.error(JSON.stringify({ level: 'error', msg: 'Forced shutdown after timeout' }));
    process.exit(1);
  }, 15000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = app; // exported for testing
