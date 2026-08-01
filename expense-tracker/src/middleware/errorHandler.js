/**
 * Centralized Express Error Handler Middleware.
 * Standardizes error responses across all API endpoints.
 *
 * @param {Error} err - Error object thrown by routes/controllers
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next callback
 */
function errorHandler(err, req, res, next) {
  // Handle syntax error from malformed JSON payloads (express.json parser error)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Validation failed',
      details: ['Invalid JSON syntax in request body']
    });
  }

  // Determine status code (default to 500 Unexpected error)
  const statusCode = err.status || err.statusCode || 500;

  // Format response message
  const errorResponse = {
    error: statusCode === 500 ? 'Unexpected error' : (err.error || err.message || 'Error occurred')
  };

  // Attach validation details if present
  if (err.details && Array.isArray(err.details)) {
    errorResponse.details = err.details;
  }

  // Include error message for unexpected errors in development mode
  if (statusCode === 500 && process.env.NODE_ENV !== 'production') {
    errorResponse.message = err.message;
  }

  // Log 500 errors to console for monitoring
  if (statusCode === 500) {
    console.error(`[500 Internal Error] ${req.method} ${req.url}:`, err.stack || err.message);
  }

  res.status(statusCode).json(errorResponse);
}

module.exports = errorHandler;
