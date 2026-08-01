const expenseService = require('../services/expenseService');

/**
 * Controller class handling HTTP requests and responses for Expenses.
 */
class ExpenseController {
  /**
   * GET /expenses
   * Retrieves all expenses, or filters by query param ?category=Food
   */
  async getExpenses(req, res, next) {
    try {
      const { category } = req.query;
      const expenses = await expenseService.getAllExpenses(category);
      return res.status(200).json(expenses);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /expenses/summary
   * Returns total expenses overall and grouped by category
   */
  async getSummary(req, res, next) {
    try {
      const summary = await expenseService.getExpenseSummary();
      return res.status(200).json(summary);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * POST /expenses
   * Creates a new expense record (request body is pre-validated by middleware)
   */
  async createExpense(req, res, next) {
    try {
      const createdExpense = await expenseService.createExpense(req.body);
      return res.status(201).json(createdExpense);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * DELETE /expenses/:id
   * Deletes an expense by ID
   */
  async deleteExpense(req, res, next) {
    try {
      const { id } = req.params;
      const deletedExpense = await expenseService.deleteExpense(id);
      return res.status(200).json({
        message: 'Expense deleted successfully',
        id: deletedExpense.id,
        expense: deletedExpense
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ExpenseController();
