/**
 * Request validation middleware for POST /expenses.
 * Validates required fields: title, amount, category, date.
 * Enforces data types, positive amount, and ISO format for date.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function validateExpense(req, res, next) {
  const { title, amount, category, date } = req.body || {};
  const errors = [];

  // 1. Validate title
  if (title === undefined || title === null || typeof title !== 'string' || !title.trim()) {
    errors.push('title is required and must be a non-empty string');
  }

  // 2. Validate amount
  if (amount === undefined || amount === null) {
    errors.push('amount is required');
  } else if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount) || amount <= 0) {
    errors.push('amount must be a positive number greater than 0');
  }

  // 3. Validate category
  if (category === undefined || category === null || typeof category !== 'string' || !category.trim()) {
    errors.push('category is required and must be a non-empty string');
  }

  // 4. Validate date (ISO format YYYY-MM-DD or full ISO 8601 string)
  const isoRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})?)?$/;
  if (!date || typeof date !== 'string' || !isoRegex.test(date) || isNaN(Date.parse(date))) {
    errors.push('date is required and must be a valid ISO format date string (e.g. 2026-07-31)');
  }

  // If any validation errors occurred, return HTTP 400 Bad Request immediately
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  next();
}

module.exports = validateExpense;
