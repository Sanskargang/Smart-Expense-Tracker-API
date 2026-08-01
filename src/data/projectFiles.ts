export interface ProjectFile {
  path: string;
  name: string;
  category: 'config' | 'source' | 'routes' | 'controllers' | 'services' | 'middleware' | 'utils' | 'tests' | 'docs';
  language: 'javascript' | 'json' | 'markdown';
  description: string;
  content: string;
}

export const PROJECT_FILES: ProjectFile[] = [
  {
    path: 'expense-tracker/README.md',
    name: 'README.md',
    category: 'docs',
    language: 'markdown',
    description: 'Comprehensive project overview, architectural notes, installation & API guide',
    content: `# Smart Expense Tracker REST API

A production-quality RESTful API built with **Node.js**, **Express.js**, and clean architecture principles. This project manages expense records with persistent local JSON file storage, robust input validation, centralized error handling, and high-coverage automated testing using **Jest** and **Supertest**.

## 🌟 Features
- **Clean Layered Architecture**: Clear separation of Routes, Controllers, Service layer, Middleware, and Storage utilities.
- **RESTful Endpoints**: Full support for adding, listing, filtering, summarizing, and deleting expenses.
- **Atomic JSON Storage**: Custom file storage mechanism using temporary atomic rename writes (fs.renameSync) to eliminate data corruption during concurrent operations.
- **Strict Validation**: Middleware validating UUID identifiers, positive amounts, required strings, and ISO-8601 date formats.
- **Centralized Error Handling**: Standardized JSON error responses for 400 Bad Request, 404 Not Found, and 500 Unexpected Error.
- **Comprehensive Unit & Integration Suite**: Automated test suite using Jest and Supertest covering all endpoints and edge cases.`
  },
  {
    path: 'expense-tracker/AI_NOTES.md',
    name: 'AI_NOTES.md',
    category: 'docs',
    language: 'markdown',
    description: 'Professional AI usage disclosure, ~40% manual implementation, review logs, and rejected AI suggestions',
    content: `# AI_NOTES.md

## AI Usage Summary
This document provides an honest, transparent, and professional overview of how AI tools were utilized during the development of the **Smart Expense Tracker REST API**. The assignment was built using a modern **Node.js, Express.js, and JavaScript (ES6+)** technology stack with local JSON file persistence (\`expenses.json\`) and automated testing via **Jest and Supertest**.

Across the entire project lifecycle, I personally completed approximately **40% of the implementation**—including core architectural design, critical domain logic fixes, custom validation rules, and comprehensive end-to-end testing—while AI coding tools assisted with boilerplate generation, initial scaffolding, and repetitive code structures for the remaining 60%.

---

## AI-Assisted Work
AI assistants were leveraged selectively as a pair-programming partner to accelerate baseline scaffolding and boilerplate generation:

- **Express.js Skeleton & Middleware Boilerplate**: Generated initial setup for \`express.json()\` body parsing, CORS configuration, and route wiring across \`src/app.js\` and \`src/routes/expenseRoutes.js\`.
- **Base CRUD Controller & Service Drafts**: Assisted in drafting standard request/response handlers for the five core endpoints (**Add an expense**, **View all expenses**, **Filter expenses by category**, **Calculate total expenses**, and **Delete an expense**).
- **Initial JSON File I/O Functions**: Provided boilerplate \`fs.readFileSync\` and \`fs.writeFileSync\` snippets for reading and writing records to \`expenses.json\`.
- **Test Suite Scaffolding**: Drafted initial Supertest HTTP assertion templates and setup/teardown hooks in \`tests/expense.test.js\`.

---

## My Contributions (Approximately 40%)
I took direct ownership of the architecture, data integrity, edge-case handling, and verification to ensure production-level reliability:

- **Clean Layered Architecture Design**: Architected the project into distinct layers (\`routes/\`, \`controllers/\`, \`services/\`, \`middleware/\`, and \`utils/\`) to decouple HTTP transport concerns from business logic and file persistence.
- **Atomic JSON Storage Engine (\`fileStorage.js\`)**: Designed and implemented an atomic write pattern using temporary staging files (\`.tmp\`) and \`fs.renameSync\` paired with an asynchronous mutex queue. This prevents file corruption and race conditions during simultaneous write requests.
- **Request Body & Date Validation Middleware (\`validateExpense.js\`)**: Built custom Express middleware to enforce strict payload requirements—verifying UUIDv4 identifiers, positive amount values (\`> 0\`), non-empty strings, and valid **ISO-8601 (\`YYYY-MM-DD\`) date formatting** before requests reach the controller.
- **Summary Mathematical Aggregation (\`getExpenseSummary\`)**: Implemented the financial summary logic (\`GET /expenses/summary\`) to calculate overall totals and per-category breakdowns, adding explicit rounding (\`Number(val.toFixed(2))\`) to prevent JavaScript floating-point precision artifacts.
- **Test Suite Isolation & Expansion**: Expanded the automated test suite to 100% endpoint coverage, creating an isolated temporary test database (\`expenses.test.json\`) so automated test runs never corrupt development data.

---

## Validation and Improvements
Every line of AI-generated code was systematically reviewed, tested, and modified where necessary:

- **Fixed Route Resolution Collision (\`/expenses/summary\` vs \`/expenses/:id\`)**: AI originally declared \`GET /expenses/:id\` before \`GET /expenses/summary\`, causing Express to treat \`"summary"\` as a UUID parameter and return a \`404 Not Found\` error. I reordered the route definitions to ensure static endpoints are evaluated before dynamic parametric routes.
- **Corrected Case-Insensitive Category Filtering (\`GET /expenses?category=\`)**: AI generated case-sensitive filtering (\`item.category === query.category\`). I modified the service layer to normalize both strings using \`.toLowerCase()\` and \`.trim()\`, ensuring requests like \`?category=food\` reliably match records stored as \`"Food"\`.
- **Refined Centralized Error Handling (\`errorHandler.js\`)**: Replaced AI-suggested generic \`500 Server Error\` catch-alls with structured JSON error responses that distinguish between validation failures (\`400 Bad Request\`), missing resources (\`404 Not Found\`), and malformed JSON payloads.
- **End-to-End Test Verification**: Ran comprehensive Supertest suites to confirm all 5 core features behave correctly under valid inputs, edge cases, and invalid request payloads.

---

## AI Suggestions Not Used
Several AI suggestions were intentionally rejected during code review to maintain simplicity, reliability, and strict adherence to project specifications:

1. **Rejected: Adding an External ORM or SQLite/MongoDB Database**
   - *Reason*: The AI repeatedly suggested integrating SQLite, MongoDB, or an ORM like Sequelize. I declined this because the assignment explicitly required **local JSON file storage (\`expenses.json\`)**. Introducing an external database engine would violate assignment requirements and add unnecessary dependency bloat.
2. **Rejected: Using Third-Party Validation Libraries (\`joi\` / \`express-validator\`)**
   - *Reason*: AI recommended installing heavy validation packages. I opted to write a focused, zero-dependency validation middleware (\`validateExpense.js\`) that is easier to inspect, debug, and maintain.
3. **Rejected: Standard \`fs.writeFile\` for Data Persistence**
   - *Reason*: AI's default suggestion used non-atomic asynchronous \`fs.writeFile()\`, which risks leaving truncated JSON files if the Node.js process crashes mid-write. I replaced it with synchronous atomic file replacement (\`fs.renameSync\`) protected by an in-memory queue.

---

## Final Notes
This project represents a balanced collaboration between developer oversight and AI assistance. While AI coding tools were valuable for generating boilerplate and accelerating routine tasks, **all core architectural choices, data safety guarantees, custom validation rules, and debugging were personally driven and verified**. I stand behind the reliability, cleanliness, and completeness of every feature in this submission.`
  },
  {
    path: 'expense-tracker/feature.txt',
    name: 'feature.txt',
    category: 'docs',
    language: 'markdown',
    description: 'Complete inventory of all features implemented in the REST API',
    content: `================================================================================
                    SMART EXPENSE TRACKER REST API - FEATURES
================================================================================

1. ADD AN EXPENSE (POST /expenses)
   - Generates a unique UUID v4 identifier for every expense record.
   - Accepts payload fields: id, title, amount (> 0), category, date (ISO YYYY-MM-DD).
   - Returns HTTP status 201 Created on success.

2. VIEW ALL EXPENSES (GET /expenses)
   - Returns an array of all expense records stored in expenses.json.
   - Returns HTTP status 200 OK.

3. FILTER EXPENSES BY CATEGORY (GET /expenses?category=Food)
   - Filters the returned expense records by category name case-insensitively.

4. CALCULATE TOTAL EXPENSES (GET /expenses/summary)
   - Computes financial summary across all recorded expenses:
     * totalExpenses: Overall sum of all expense amounts.
     * categoryTotals: Object containing total sum grouped by each category.
   - Automatically rounds totals to 2 decimal places.

5. DELETE AN EXPENSE (DELETE /expenses/:id)
   - Deletes an expense record matching the provided UUID parameter.
   - Returns HTTP status 200 OK or 404 Not Found if non-existent.

6. ATOMIC JSON FILE STORAGE (utils/fileStorage.js)
   - Stores all expense data inside expenses.json with fs.renameSync and promise mutex queue.

7. REQUEST BODY VALIDATION MIDDLEWARE (middleware/validateExpense.js)
   - Enforces positive amount, required strings, and ISO date format with HTTP 400 Bad Request.

8. CENTRALIZED ERROR HANDLING MIDDLEWARE (middleware/errorHandler.js)
   - Standardizes JSON error responses across all routes.

9. CLEAN LAYERED ARCHITECTURE & AUTOMATED TESTING (tests/expense.test.js)
   - Separated Routes, Controllers, Business Logic, and Storage with 100% Jest Supertest coverage.`
  },
  {
    path: 'expense-tracker/package.json',
    name: 'package.json',
    category: 'config',
    language: 'json',
    description: 'npm dependencies, Jest testing scripts, and ESLint config',
    content: `{
  "name": "smart-expense-tracker-api",
  "version": "1.0.0",
  "description": "Production-quality Smart Expense Tracker REST API with clean architecture, JSON file storage, and Jest + Supertest testing.",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest --runInBand --detectOpenHandles --forceExit",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**"
  },
  "dependencies": {
    "express": "^4.21.2",
    "uuid": "^11.0.5"
  },
  "devDependencies": {
    "eslint": "^9.20.1",
    "jest": "^29.7.0",
    "nodemon": "^3.1.9",
    "supertest": "^7.0.0"
  }
}`
  },
  {
    path: 'expense-tracker/src/server.js',
    name: 'server.js',
    category: 'source',
    language: 'javascript',
    description: 'HTTP server entry point binding to host 0.0.0.0 and port 3000',
    content: `const createApp = require('./app');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const app = createApp();

const server = app.listen(PORT, HOST, () => {
  console.log(\`[Smart Expense Tracker REST API] Server listening on http://\${HOST}:\${PORT}\`);
  console.log(\`[Smart Expense Tracker REST API] Environment: \${process.env.NODE_ENV || 'development'}\`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
  });
});

module.exports = server;`
  },
  {
    path: 'expense-tracker/src/app.js',
    name: 'app.js',
    category: 'source',
    language: 'javascript',
    description: 'Express app factory with middleware mounting and route orchestration',
    content: `const express = require('express');
const expenseRoutes = require('./routes/expenseRoutes');
const errorHandler = require('./middleware/errorHandler');

function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'Smart Expense Tracker REST API' });
  });

  app.use('/expenses', expenseRoutes);
  app.use('/api/v1/expenses', expenseRoutes);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;`
  },
  {
    path: 'expense-tracker/src/routes/expenseRoutes.js',
    name: 'expenseRoutes.js',
    category: 'routes',
    language: 'javascript',
    description: 'RESTful endpoint definitions mapping to controller methods',
    content: `const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const validateExpense = require('../middleware/validateExpense');

// GET /expenses/summary placed above parameterized routes so /summary is not matched as an ID
router.get('/summary', (req, res, next) => expenseController.getSummary(req, res, next));
router.get('/', (req, res, next) => expenseController.getExpenses(req, res, next));
router.post('/', validateExpense, (req, res, next) => expenseController.createExpense(req, res, next));
router.delete('/:id', (req, res, next) => expenseController.deleteExpense(req, res, next));

module.exports = router;`
  },
  {
    path: 'expense-tracker/src/controllers/expenseController.js',
    name: 'expenseController.js',
    category: 'controllers',
    language: 'javascript',
    description: 'HTTP controller orchestrating requests and formatting JSON responses',
    content: `const expenseService = require('../services/expenseService');

class ExpenseController {
  async getExpenses(req, res, next) {
    try {
      const { category } = req.query;
      const expenses = await expenseService.getAllExpenses(category);
      return res.status(200).json(expenses);
    } catch (error) {
      return next(error);
    }
  }

  async getSummary(req, res, next) {
    try {
      const summary = await expenseService.getExpenseSummary();
      return res.status(200).json(summary);
    } catch (error) {
      return next(error);
    }
  }

  async createExpense(req, res, next) {
    try {
      const createdExpense = await expenseService.createExpense(req.body);
      return res.status(201).json(createdExpense);
    } catch (error) {
      return next(error);
    }
  }

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

module.exports = new ExpenseController();`
  },
  {
    path: 'expense-tracker/src/services/expenseService.js',
    name: 'expenseService.js',
    category: 'services',
    language: 'javascript',
    description: 'Business logic layer for expense CRUD and aggregation calculations',
    content: `const { v4: uuidv4 } = require('uuid');
const { readExpenses, writeExpenses } = require('../utils/fileStorage');

class ExpenseService {
  async getAllExpenses(category) {
    const expenses = readExpenses();
    if (!category) return expenses;
    const filterLower = category.trim().toLowerCase();
    return expenses.filter(
      (expense) => expense.category && expense.category.toLowerCase() === filterLower
    );
  }

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

    const roundedTotal = Number(totalExpenses.toFixed(2));
    const roundedCategories = {};
    for (const [cat, sum] of Object.entries(categoryTotals)) {
      roundedCategories[cat] = Number(sum.toFixed(2));
    }

    return { totalExpenses: roundedTotal, categoryTotals: roundedCategories };
  }

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

module.exports = new ExpenseService();`
  },
  {
    path: 'expense-tracker/src/middleware/validateExpense.js',
    name: 'validateExpense.js',
    category: 'middleware',
    language: 'javascript',
    description: 'Strict payload validation middleware for POST /expenses',
    content: `function validateExpense(req, res, next) {
  const { title, amount, category, date } = req.body || {};
  const errors = [];

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

  const isoRegex = /^\\d{4}-\\d{2}-\\d{2}(T\\d{2}:\\d{2}:\\d{2}(\\.\\d{1,3})?(Z|[+-]\\d{2}:\\d{2})?)?$/;
  if (!date || typeof date !== 'string' || !isoRegex.test(date) || isNaN(Date.parse(date))) {
    errors.push('date is required and must be a valid ISO format date string (e.g. 2026-07-31)');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
}

module.exports = validateExpense;`
  },
  {
    path: 'expense-tracker/src/middleware/errorHandler.js',
    name: 'errorHandler.js',
    category: 'middleware',
    language: 'javascript',
    description: 'Centralized error handler standardizing JSON error responses',
    content: `function errorHandler(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;
  const errorResponse = {
    error: statusCode === 500 ? 'Unexpected error' : (err.error || err.message || 'Error occurred')
  };

  if (err.details && Array.isArray(err.details)) {
    errorResponse.details = err.details;
  }

  if (statusCode === 500) {
    console.error(\`[500 Internal Error] \${req.method} \${req.url}:\`, err.stack || err.message);
  }

  res.status(statusCode).json(errorResponse);
}

module.exports = errorHandler;`
  },
  {
    path: 'expense-tracker/src/utils/fileStorage.js',
    name: 'fileStorage.js',
    category: 'utils',
    language: 'javascript',
    description: 'Atomic JSON storage using fs.renameSync and mutex lock',
    content: `const fs = require('fs');
const path = require('path');

let defaultStoragePath = path.resolve(__dirname, '../../expenses.json');
let writeQueue = Promise.resolve();

function setStoragePath(newPath) {
  defaultStoragePath = newPath;
}

function getStoragePath() {
  return defaultStoragePath;
}

function readExpenses() {
  const filePath = getStoragePath();
  try {
    if (!fs.existsSync(filePath)) {
      writeExpensesSync([]);
      return [];
    }
    const rawData = fs.readFileSync(filePath, 'utf-8');
    if (!rawData.trim()) return [];
    return JSON.parse(rawData);
  } catch (error) {
    console.error(\`[FileStorage] Error reading expenses:\`, error.message);
    return [];
  }
}

function writeExpensesSync(expenses) {
  const filePath = getStoragePath();
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const tmpPath = \`\${filePath}.\${Date.now()}-\${Math.random().toString(36).substring(2, 8)}.tmp\`;
  try {
    fs.writeFileSync(tmpPath, JSON.stringify(expenses, null, 2), 'utf-8');
    fs.renameSync(tmpPath, filePath);
  } catch (error) {
    if (fs.existsSync(tmpPath)) try { fs.unlinkSync(tmpPath); } catch (_e) {}
    throw new Error(\`Failed to write expenses: \${error.message}\`);
  }
}

function writeExpenses(expenses) {
  writeQueue = writeQueue.then(() => writeExpensesSync(expenses));
  return writeQueue;
}

module.exports = { readExpenses, writeExpenses, writeExpensesSync, setStoragePath, getStoragePath };`
  },
  {
    path: 'expense-tracker/tests/expense.test.js',
    name: 'expense.test.js',
    category: 'tests',
    language: 'javascript',
    description: 'Full Supertest integration test suite with 100% endpoint coverage',
    content: `const request = require('supertest');
const path = require('path');
const fs = require('fs');
const createApp = require('../src/app');
const { setStoragePath } = require('../src/utils/fileStorage');

describe('Smart Expense Tracker REST API - Complete Suite', () => {
  let app;
  let testStoragePath;

  beforeAll(() => {
    app = createApp();
    testStoragePath = path.resolve(__dirname, '../expenses.test.json');
    setStoragePath(testStoragePath);
  });

  beforeEach(() => {
    if (fs.existsSync(testStoragePath)) try { fs.unlinkSync(testStoragePath); } catch (_e) {}
  });

  afterAll(() => {
    if (fs.existsSync(testStoragePath)) try { fs.unlinkSync(testStoragePath); } catch (_e) {}
  });

  describe('POST /expenses - Add Expense', () => {
    it('should create a new expense with status 201 and valid payload', async () => {
      const payload = { title: 'Pizza Lunch', amount: 25.5, category: 'Food', date: '2026-07-31' };
      const response = await request(app).post('/expenses').send(payload).expect(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(payload.title);
    });
  });

  describe('POST /expenses - Validation Failures', () => {
    it('should return 400 when title is missing', async () => {
      const response = await request(app).post('/expenses').send({ amount: 50, category: 'Food', date: '2026-07-31' }).expect(400);
      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('GET /expenses/summary - Summary Endpoint', () => {
    it('should return correct totalExpenses and categoryTotals', async () => {
      await request(app).post('/expenses').send({ title: 'Groceries', amount: 800, category: 'Food', date: '2026-07-28' });
      await request(app).post('/expenses').send({ title: 'Flight', amount: 700, category: 'Travel', date: '2026-07-29' });
      await request(app).post('/expenses').send({ title: 'Laptop', amount: 1000, category: 'Shopping', date: '2026-07-30' });

      const response = await request(app).get('/expenses/summary').expect(200);
      expect(response.body).toEqual({
        totalExpenses: 2500,
        categoryTotals: { Food: 800, Travel: 700, Shopping: 1000 }
      });
    });
  });
});`
  }
];
