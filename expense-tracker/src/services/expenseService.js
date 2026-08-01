const { v4: uuidv4 } = require('uuid');
const { readExpenses, writeExpenses } = require('../utils/fileStorage');

/**
 * Service class handling all business logic for Expense operations.
 * Isolates data storage concerns from HTTP controllers.
 */
class ExpenseService {
  /**
   * Retrieves all expenses, optionally filtered by category.
   * @param {string} [category] - Optional category name to filter by
   * @returns {Promise<Array<Object>>} List of matching expenses
   */
  async getAllExpenses(category) {
    const expenses = readExpenses();
    if (!category) {
      return expenses;
    }
    const filterLower = category.trim().toLowerCase();
    return expenses.filter(
      (expense) => expense.category && expense.category.toLowerCase() === filterLower
    );
  }

  /**
   * Calculates overall total expenses and breakdown by category.
   * Uses clean rounding to prevent JavaScript floating-point precision bugs.
   * @returns {Promise<{ totalExpenses: number, categoryTotals: Object<string, number> }>}
   */
  async getExpenseSummary() {
    const expenses = readExpenses();
    let totalExpenses = 0;
    const categoryTotals = {};

    for (const item of expenses) {
      const amount = Number(item.amount) || 0;
      totalExpenses += amount;

      const cat = item.category || 'Uncategorized';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
    }

    // Round overall total and each category total to 2 decimal places
    const roundedTotal = Number(totalExpenses.toFixed(2));
    const roundedCategories = {};
    for (const [cat, sum] of Object.entries(categoryTotals)) {
      roundedCategories[cat] = Number(sum.toFixed(2));
    }

    return {
      totalExpenses: roundedTotal,
      categoryTotals: roundedCategories
    };
  }

  /**
   * Creates a new expense record with a UUIDv4 identifier.
   * @param {Object} expenseData - Validated payload { title, amount, category, date }
   * @returns {Promise<Object>} Created expense record
   */
  async createExpense({ title, amount, category, date }) {
    const expenses = readExpenses();

    const newExpense = {
      id: uuidv4(),
      title: title.trim(),
      amount: Number(amount),
      category: category.trim(),
      date: date.trim()
    };

    expenses.push(newExpense);
    await writeExpenses(expenses);

    return newExpense;
  }

  /**
   * Deletes an expense by its UUID.
   * @param {string} id - UUID of the expense to delete
   * @returns {Promise<Object>} Deleted expense record
   * @throws {Error} 404 error if expense is not found
   */
  async deleteExpense(id) {
    const expenses = readExpenses();
    const index = expenses.findIndex((item) => item.id === id);

    if (index === -1) {
      const notFoundError = new Error('Expense not found');
      notFoundError.status = 404;
      throw notFoundError;
    }

    const [deletedExpense] = expenses.splice(index, 1);
    await writeExpenses(expenses);

    return deletedExpense;
  }
}

module.exports = new ExpenseService();
