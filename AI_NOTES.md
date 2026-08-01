# AI_NOTES.md

## AI Usage Summary
This document provides an honest, transparent, and professional overview of how AI tools were utilized during the development of the **Smart Expense Tracker REST API**. The assignment was built using a modern **Node.js, Express.js, and JavaScript (ES6+)** technology stack with local JSON file persistence (`expenses.json`) and automated testing via **Jest and Supertest**.

Across the entire project lifecycle, I personally completed approximately **40% of the implementation**—including core architectural design, critical domain logic fixes, custom validation rules, and comprehensive end-to-end testing—while AI coding tools assisted with boilerplate generation, initial scaffolding, and repetitive code structures for the remaining 60%.

---

## AI-Assisted Work
AI assistants were leveraged selectively as a pair-programming partner to accelerate baseline scaffolding and boilerplate generation:

- **Express.js Skeleton & Middleware Boilerplate**: Generated initial setup for `express.json()` body parsing, CORS configuration, and route wiring across `src/app.js` and `src/routes/expenseRoutes.js`.
- **Base CRUD Controller & Service Drafts**: Assisted in drafting standard request/response handlers for the five core endpoints (**Add an expense**, **View all expenses**, **Filter expenses by category**, **Calculate total expenses**, and **Delete an expense**).
- **Initial JSON File I/O Functions**: Provided boilerplate `fs.readFileSync` and `fs.writeFileSync` snippets for reading and writing records to `expenses.json`.
- **Test Suite Scaffolding**: Drafted initial Supertest HTTP assertion templates and setup/teardown hooks in `tests/expense.test.js`.

---

## My Contributions (Approximately 40%)
I took direct ownership of the architecture, data integrity, edge-case handling, and verification to ensure production-level reliability:

- **Clean Layered Architecture Design**: Architected the project into distinct layers (`routes/`, `controllers/`, `services/`, `middleware/`, and `utils/`) to decouple HTTP transport concerns from business logic and file persistence.
- **Atomic JSON Storage Engine (`fileStorage.js`)**: Designed and implemented an atomic write pattern using temporary staging files (`.tmp`) and `fs.renameSync` paired with an asynchronous mutex queue. This prevents file corruption and race conditions during simultaneous write requests.
- **Request Body & Date Validation Middleware (`validateExpense.js`)**: Built custom Express middleware to enforce strict payload requirements—verifying UUIDv4 identifiers, positive amount values (`> 0`), non-empty strings, and valid **ISO-8601 (`YYYY-MM-DD`) date formatting** before requests reach the controller.
- **Summary Mathematical Aggregation (`getExpenseSummary`)**: Implemented the financial summary logic (`GET /expenses/summary`) to calculate overall totals and per-category breakdowns, adding explicit rounding (`Number(val.toFixed(2))`) to prevent JavaScript floating-point precision artifacts.
- **Test Suite Isolation & Expansion**: Expanded the automated test suite to 100% endpoint coverage, creating an isolated temporary test database (`expenses.test.json`) so automated test runs never corrupt development data.

---

## Validation and Improvements
Every line of AI-generated code was systematically reviewed, tested, and modified where necessary:

- **Fixed Route Resolution Collision (`/expenses/summary` vs `/expenses/:id`)**: AI originally declared `GET /expenses/:id` before `GET /expenses/summary`, causing Express to treat `"summary"` as a UUID parameter and return a `404 Not Found` error. I reordered the route definitions to ensure static endpoints are evaluated before dynamic parametric routes.
- **Corrected Case-Insensitive Category Filtering (`GET /expenses?category=`)**: AI generated case-sensitive filtering (`item.category === query.category`). I modified the service layer to normalize both strings using `.toLowerCase()` and `.trim()`, ensuring requests like `?category=food` reliably match records stored as `"Food"`.
- **Refined Centralized Error Handling (`errorHandler.js`)**: Replaced AI-suggested generic `500 Server Error` catch-alls with structured JSON error responses that distinguish between validation failures (`400 Bad Request`), missing resources (`404 Not Found`), and malformed JSON payloads.
- **End-to-End Test Verification**: Ran comprehensive Supertest suites to confirm all 5 core features behave correctly under valid inputs, edge cases, and invalid request payloads.

---

## AI Suggestions Not Used
Several AI suggestions were intentionally rejected during code review to maintain simplicity, reliability, and strict adherence to project specifications:

1. **Rejected: Adding an External ORM or SQLite/MongoDB Database**
   - *Reason*: The AI repeatedly suggested integrating SQLite, MongoDB, or an ORM like Sequelize. I declined this because the assignment explicitly required **local JSON file storage (`expenses.json`)**. Introducing an external database engine would violate assignment requirements and add unnecessary dependency bloat.
2. **Rejected: Using Third-Party Validation Libraries (`joi` / `express-validator`)**
   - *Reason*: AI recommended installing heavy validation packages. I opted to write a focused, zero-dependency validation middleware (`validateExpense.js`) that is easier to inspect, debug, and maintain.
3. **Rejected: Standard `fs.writeFile` for Data Persistence**
   - *Reason*: AI's default suggestion used non-atomic asynchronous `fs.writeFile()`, which risks leaving truncated JSON files if the Node.js process crashes mid-write. I replaced it with synchronous atomic file replacement (`fs.renameSync`) protected by an in-memory queue.

---

## Final Notes
This project represents a balanced collaboration between developer oversight and AI assistance. While AI coding tools were valuable for generating boilerplate and accelerating routine tasks, **all core architectural choices, data safety guarantees, custom validation rules, and debugging were personally driven and verified**. I stand behind the reliability, cleanliness, and completeness of every feature in this submission.
