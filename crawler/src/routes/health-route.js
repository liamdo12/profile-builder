/**
 * Health check route.
 * GET /health — returns service status for load balancer / ECS health checks.
 */

const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.json({ status: 'ok', browser: 'ready', timestamp: new Date().toISOString() });
});

module.exports = router;
