const request = require('supertest');
const path = require('path');
const fs = require('fs');
const createApp = require('../src/app');
const { setStoragePath } = require('../src/utils/fileStorage');

describe('Smart Expense Tracker REST API - Complete Suite', () => {
  let app;
  let testStoragePath;

  beforeAll(() => {
    app = createApp();
    // Use an isolated temporary JSON storage file for unit & integration tests
    testStoragePath = path.resolve(__dirname, '../expenses.test.json');
    setStoragePath(testStoragePath);
  });

  beforeEach(() => {
    // Reset test storage before every single test case
    if (fs.existsSync(testStoragePath)) {
      try {
        fs.unlinkSync(testStoragePath);
      } catch (_e) {
        // ignore
      }
    }
  });

  afterAll(() => {
    // Clean up temporary storage file after test suite completes
    if (fs.existsSync(testStoragePath)) {
      try {
        fs.unlinkSync(testStoragePath);
      } catch (_e) {
        // ignore
      }
    }
  });

  describe('POST /expenses - Add Expense', () => {
    it('should create a new expense with status 201 and valid payload', async () => {
      const payload = {
        title: 'Pizza Lunch',
        amount: 25.5,
        category: 'Food',
        date: '2026-07-31'
      };

      const response = await request(app)
        .post('/expenses')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(typeof response.body.id).toBe('string');
      expect(response.body.title).toBe(payload.title);
      expect(response.body.amount).toBe(payload.amount);
      expect(response.body.category).toBe(payload.category);
      expect(response.body.date).toBe(payload.date);
    });

    it('should trim string inputs when adding an expense', async () => {
      const response = await request(app)
        .post('/expenses')
        .send({
          title: '   Coffee  ',
          amount: 5,
          category: '  Food ',
          date: '2026-07-31'
        })
        .expect(201);

      expect(response.body.title).toBe('Coffee');
      expect(response.body.category).toBe('Food');
    });
  });

  describe('POST /expenses - Validation Failures', () => {
    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/expenses')
        .send({
          amount: 50,
          category: 'Food',
          date: '2026-07-31'
        })
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([expect.stringContaining('title is required')])
      );
    });

    it('should return 400 when amount is zero or negative', async () => {
      const response = await request(app)
        .post('/expenses')
        .send({
          title: 'Bad Amount',
          amount: -10,
          category: 'Food',
          date: '2026-07-31'
        })
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([expect.stringContaining('amount must be a positive number')])
      );
    });

    it('should return 400 when date is not valid ISO format', async () => {
      const response = await request(app)
        .post('/expenses')
        .send({
          title: 'Invalid Date Expense',
          amount: 100,
          category: 'Shopping',
          date: '31/07/2026'
        })
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([expect.stringContaining('valid ISO format date string')])
      );
    });
  });

  describe('GET /expenses - Get All & Filter', () => {
    beforeEach(async () => {
      await request(app).post('/expenses').send({
        title: 'Sushi Dinner',
        amount: 80,
        category: 'Food',
        date: '2026-07-30'
      });
      await request(app).post('/expenses').send({
        title: 'Train Ticket',
        amount: 45,
        category: 'Travel',
        date: '2026-07-31'
      });
    });

    it('should return all expenses with status 200', async () => {
      const response = await request(app)
        .get('/expenses')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should filter expenses by category case-insensitively', async () => {
      const response = await request(app)
        .get('/expenses?category=food')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe('Sushi Dinner');
    });

    it('should return empty array when filtering by non-existing category', async () => {
      const response = await request(app)
        .get('/expenses?category=Luxury')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /expenses/summary - Summary Endpoint', () => {
    it('should return correct totalExpenses and categoryTotals', async () => {
      // Create 3 sample expenses
      await request(app).post('/expenses').send({
        title: 'Groceries',
        amount: 800,
        category: 'Food',
        date: '2026-07-28'
      });
      await request(app).post('/expenses').send({
        title: 'Flight',
        amount: 700,
        category: 'Travel',
        date: '2026-07-29'
      });
      await request(app).post('/expenses').send({
        title: 'Laptop Monitor',
        amount: 1000,
        category: 'Shopping',
        date: '2026-07-30'
      });

      const response = await request(app)
        .get('/expenses/summary')
        .expect(200);

      expect(response.body).toEqual({
        totalExpenses: 2500,
        categoryTotals: {
          Food: 800,
          Travel: 700,
          Shopping: 1000
        }
      });
    });
  });

  describe('DELETE /expenses/:id - Delete Expense', () => {
    it('should delete an existing expense and return 200', async () => {
      const createdResponse = await request(app)
        .post('/expenses')
        .send({
          title: 'To Be Deleted',
          amount: 15,
          category: 'Misc',
          date: '2026-07-31'
        })
        .expect(201);

      const id = createdResponse.body.id;

      const deleteResponse = await request(app)
        .delete(`/expenses/${id}`)
        .expect(200);

      expect(deleteResponse.body.message).toBe('Expense deleted successfully');
      expect(deleteResponse.body.id).toBe(id);

      // Verify it is removed from list
      const getAllResponse = await request(app).get('/expenses').expect(200);
      expect(getAllResponse.body.length).toBe(0);
    });

    it('should return 404 when deleting a non-existing UUID', async () => {
      const fakeUuid = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .delete(`/expenses/${fakeUuid}`)
        .expect(404);

      expect(response.body.error).toBe('Expense not found');
    });
  });
});
