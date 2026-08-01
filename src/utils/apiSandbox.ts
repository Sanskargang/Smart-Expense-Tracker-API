import { v4 as uuidv4 } from 'uuid';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export interface SummaryResponse {
  totalExpenses: number;
  categoryTotals: Record<string, number>;
}

export interface ApiResponse<T = any> {
  status: number;
  statusText: string;
  data?: T;
  error?: string;
  details?: string[];
}

// Initial default expenses matching assignment example
const DEFAULT_EXPENSES: Expense[] = [
  {
    id: 'e44c2bc0-a9a7-4cb3-8a3d-36d1b74d6c11',
    title: 'Grocery Shopping',
    amount: 800,
    category: 'Food',
    date: '2026-07-28'
  },
  {
    id: 'f82b79a1-5c34-4e89-8d11-9a74656b2b22',
    title: 'Flight to Tokyo',
    amount: 700,
    category: 'Travel',
    date: '2026-07-29'
  },
  {
    "id": "c13d9a04-332e-4b71-92f5-8d2a609d4433",
    "title": "New Mechanical Keyboard",
    "amount": 1000,
    "category": "Shopping",
    "date": "2026-07-30"
  }
];

export class MockExpressEngine {
  private expenses: Expense[] = [...DEFAULT_EXPENSES];

  public reset(): void {
    this.expenses = [...DEFAULT_EXPENSES];
  }

  public getExpenses(category?: string): ApiResponse<Expense[]> {
    if (!category || category.trim() === '') {
      return {
        status: 200,
        statusText: '200 OK',
        data: this.expenses
      };
    }
    const filtered = this.expenses.filter(
      (e) => e.category.toLowerCase() === category.trim().toLowerCase()
    );
    return {
      status: 200,
      statusText: '200 OK',
      data: filtered
    };
  }

  public getSummary(): ApiResponse<SummaryResponse> {
    let totalExpenses = 0;
    const categoryTotals: Record<string, number> = {};

    for (const item of this.expenses) {
      const amount = Number(item.amount) || 0;
      totalExpenses += amount;
      const cat = item.category || 'Uncategorized';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
    }

    const roundedTotal = Number(totalExpenses.toFixed(2));
    const roundedCategories: Record<string, number> = {};
    for (const [cat, sum] of Object.entries(categoryTotals)) {
      roundedCategories[cat] = Number(sum.toFixed(2));
    }

    return {
      status: 200,
      statusText: '200 OK',
      data: {
        totalExpenses: roundedTotal,
        categoryTotals: roundedCategories
      }
    };
  }

  public createExpense(payload: Partial<Expense>): ApiResponse<Expense> {
    const errors: string[] = [];

    const { title, amount, category, date } = payload;

    if (title === undefined || title === null || typeof title !== 'string' || !title.trim()) {
      errors.push('title is required and must be a non-empty string');
    }

    if (amount === undefined || amount === null) {
      errors.push('amount is required');
    } else if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount) || amount <= 0) {
      errors.push('amount must be a positive number greater than 0');
    }

    if (category === undefined || category === null || typeof category !== 'string' || !category.trim()) {
      errors.push('category is required and must be a non-empty string');
    }

    const isoRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})?)?$/;
    if (!date || typeof date !== 'string' || !isoRegex.test(date) || isNaN(Date.parse(date))) {
      errors.push('date is required and must be a valid ISO format date string (e.g. 2026-07-31)');
    }

    if (errors.length > 0) {
      return {
        status: 400,
        statusText: '400 Bad Request',
        error: 'Validation failed',
        details: errors
      };
    }

    const newExpense: Expense = {
      id: uuidv4(),
      title: title!.trim(),
      amount: Number(amount),
      category: category!.trim(),
      date: date!.trim()
    };

    this.expenses.push(newExpense);

    return {
      status: 201,
      statusText: '201 Created',
      data: newExpense
    };
  }

  public deleteExpense(id: string): ApiResponse<{ message: string; id: string }> {
    const index = this.expenses.findIndex((item) => item.id === id);
    if (index === -1) {
      return {
        status: 404,
        statusText: '404 Not Found',
        error: 'Expense not found'
      };
    }

    const [deleted] = this.expenses.splice(index, 1);

    return {
      status: 200,
      statusText: '200 OK',
      data: {
        message: 'Expense deleted successfully',
        id: deleted.id
      }
    };
  }
}

export const apiEngine = new MockExpressEngine();
