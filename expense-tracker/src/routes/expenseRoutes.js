const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const validateExpense = require('../middleware/validateExpense');

// GET /expenses/summary -> Calculate total expenses and category totals
// Note: Placed above parameterized routes so /summary is not matched as an ID
router.get('/summary', (req, res, next) => expenseController.getSummary(req, res, next));

// GET /expenses -> Return all expenses or filter by ?category=...
router.get('/', (req, res, next) => expenseController.getExpenses(req, res, next));

// POST /expenses -> Create a new expense (with validation middleware)
router.post('/', validateExpense, (req, res, next) => expenseController.createExpense(req, res, next));

// DELETE /expenses/:id -> Delete an expense by UUID
router.delete('/:id', (req, res, next) => expenseController.deleteExpense(req, res, next));

module.exports = router;
