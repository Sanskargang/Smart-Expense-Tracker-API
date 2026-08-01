# Smart Expense Tracker REST API

A production-quality RESTful API built with **Node.js**, **Express.js**, and clean architecture principles. This project manages expense records with persistent local JSON file storage, robust input validation, centralized error handling, and high-coverage automated testing using **Jest** and **Supertest**.

---

## 🌟 Features

- **Clean Layered Architecture**: Clear separation of Routes, Controllers, Service layer, Middleware, and Storage utilities.
- **RESTful Endpoints**: Full support for adding, listing, filtering, summarizing, and deleting expenses.
- **Atomic JSON Storage**: Custom file storage mechanism using temporary atomic rename writes (`fs.renameSync`) to eliminate data corruption during concurrent operations.
- **Strict Validation**: Middleware validating UUID identifiers, positive amounts, required strings, and ISO-8601 date formats.
- **Centralized Error Handling**: Standardized JSON error responses for `400 Bad Request`, `404 Not Found`, and `500 Unexpected Error`.
- **Comprehensive Unit & Integration Suite**: Automated test suite using **Jest** and **Supertest** covering all endpoints and edge cases.

---

## 🛠 Technology Stack

- **Runtime**: Node.js (ES6+)
- **Framework**: Express.js (^4.21.2)
- **ID Generation**: UUID v4
- **Testing**: Jest + Supertest
- **Code Quality**: ESLint (^9.20.0), Nodemon

---

## 📁 Folder Structure

```
expense-tracker/
├── README.md               # Project documentation
├── AI_NOTES.md             # AI collaboration & validation disclosure
├── package.json            # Dependencies, scripts, Jest configuration
├── .eslintrc.json          # ESLint rules
├── expenses.json           # Local JSON database file
├── src/
│   ├── app.js              # Express app initialization & middleware mounting
│   ├── server.js           # Server entry point & HTTP port binding
│   ├── routes/
│   │   └── expenseRoutes.js # Express router definitions
│   ├── controllers/
│   │   └── expenseController.js # HTTP request/response orchestration
│   ├── services/
│   │   └── expenseService.js    # Core business logic & aggregations
│   ├── middleware/
│   │   ├── errorHandler.js      # Global JSON error handling
│   │   └── validateExpense.js   # Request body validator for POST /expenses
│   └── utils/
│       └── fileStorage.js       # Atomic JSON read/write file utility
└── tests/
    └── expense.test.js     # Full Supertest integration suite
```

---

## 🚀 Installation & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Production Server
```bash
npm start
```
The server will bind to `http://0.0.0.0:3000`.

### 3. Start Development Server (with hot reload)
```bash
npm run dev
```

### 4. Run Tests & Coverage
```bash
# Run full unit and integration test suite
npm test

# Run tests with code coverage report
npm run test:coverage
```

---

## 📡 API Endpoints & Example Requests

### Base URL: `http://localhost:3000`

---

### 1. Create a New Expense
**`POST /expenses`**

#### Request Header
```http
Content-Type: application/json
```

#### Request Body
```json
{
  "title": "Pizza",
  "amount": 500,
  "category": "Food",
  "date": "2026-07-31"
}
```

#### Response (`201 Created`)
```json
{
  "id": "a1b2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c",
  "title": "Pizza",
  "amount": 500,
  "category": "Food",
  "date": "2026-07-31"
}
```

---

### 2. Get All Expenses (or Filter by Category)
**`GET /expenses`**
**`GET /expenses?category=Food`**

#### Response (`200 OK`)
```json
[
  {
    "id": "a1b2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c",
    "title": "Pizza",
    "amount": 500,
    "category": "Food",
    "date": "2026-07-31"
  }
]
```

---

### 3. Get Expense Financial Summary
**`GET /expenses/summary`**

Returns overall expense total and breakdown grouped by category.

#### Response (`200 OK`)
```json
{
  "totalExpenses": 2500,
  "categoryTotals": {
    "Food": 800,
    "Travel": 700,
    "Shopping": 1000
  }
}
```

---

### 4. Delete an Expense
**`DELETE /expenses/:id`**

#### Example
```http
DELETE /expenses/a1b2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c
```

#### Response (`200 OK`)
```json
{
  "message": "Expense deleted successfully",
  "id": "a1b2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c"
}
```

#### Error Response (`404 Not Found`)
```json
{
  "error": "Expense not found"
}
```

---

## 🔒 Architectural Assumptions

1. **Storage Atomicity**: Since the storage engine is a local JSON file (`expenses.json`), writes are performed atomically using temporary file staging (`tmpPath` -> `fs.renameSync`) accompanied by an in-memory async mutex queue. This prevents corruption if multiple POST requests arrive concurrently.
2. **Category Normalization**: Category names are matched case-insensitively when filtering via `GET /expenses?category=Food`, but their original casing is preserved in storage and category totals.
3. **Number Precision**: Financial totals are rounded to 2 decimal places to avoid floating-point drift in JavaScript.

---

## 🔮 Future Improvements

- **Pagination & Sorting**: Add `limit`, `offset`, and `sortBy=date` query parameters to `GET /expenses`.
- **Date Range Filters**: Support querying expenses between `startDate` and `endDate`.
- **Multi-User / Auth**: Introduce JWT-based authentication and user-scoped JSON or SQLite databases.
- **Export Capabilities**: Add a `/expenses/export/csv` endpoint to generate downloadable spreadsheets.
