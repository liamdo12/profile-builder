/**
 * Express error-handling middleware.
 * Catches unhandled errors from route handlers and returns structured JSON.
 */

/**
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || err.statusCode || 500;
  console.error(JSON.stringify({
    level: 'error',
    msg: 'Unhandled request error',
    path: req.path,
    method: req.method,
    error: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  }));

  res.status(status).json({
    error: err.message || 'Internal server error',
    status,
  });
}

module.exports = { errorHandler };
