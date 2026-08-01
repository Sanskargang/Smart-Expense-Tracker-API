const fs = require('fs');
const path = require('path');

// Default path to expenses.json in the project root
let defaultStoragePath = path.resolve(__dirname, '../../expenses.json');

/**
 * Allows overriding the storage file path (useful for testing isolation).
 * @param {string} newPath - Absolute path to custom JSON file.
 */
function setStoragePath(newPath) {
  defaultStoragePath = newPath;
}

/**
 * Gets the current active storage file path.
 * @returns {string}
 */
function getStoragePath() {
  return defaultStoragePath;
}

// In-memory write queue to prevent concurrent write race conditions
let writeQueue = Promise.resolve();

/**
 * Reads all expenses from the JSON file synchronously.
 * If the file does not exist or is empty, returns an empty array and initializes it.
 * @returns {Array<Object>} List of expenses
 */
function readExpenses() {
  const filePath = getStoragePath();
  try {
    if (!fs.existsSync(filePath)) {
      // Initialize an empty file if none exists
      writeExpensesSync([]);
      return [];
    }
    const rawData = fs.readFileSync(filePath, 'utf-8');
    if (!rawData.trim()) {
      return [];
    }
    return JSON.parse(rawData);
  } catch (error) {
    // If file is corrupted, log and return empty array without crashing
    console.error(`[FileStorage] Error reading expenses from ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Atomically writes an array of expenses to the JSON file synchronously.
 * Uses a temporary file rename strategy to prevent data corruption during write failures.
 * @param {Array<Object>} expenses - Array of expense records to save
 */
function writeExpensesSync(expenses) {
  const filePath = getStoragePath();
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Use a unique temporary filename in the same directory for atomic rename
  const tmpPath = `${filePath}.${Date.now()}-${Math.random().toString(36).substring(2, 8)}.tmp`;

  try {
    const jsonString = JSON.stringify(expenses, null, 2);
    // 1. Write fully to temporary file
    fs.writeFileSync(tmpPath, jsonString, 'utf-8');
    // 2. Atomically rename temporary file over target file
    fs.renameSync(tmpPath, filePath);
  } catch (error) {
    // Clean up tmp file if write failed before rename
    if (fs.existsSync(tmpPath)) {
      try {
        fs.unlinkSync(tmpPath);
      } catch (_e) {
        // ignore cleanup errors
      }
    }
    throw new Error(`Failed to write expenses: ${error.message}`);
  }
}

/**
 * Async wrapper around writeExpensesSync using a mutex queue to prevent
 * concurrent writes from clobbering data.
 * @param {Array<Object>} expenses
 * @returns {Promise<void>}
 */
function writeExpenses(expenses) {
  writeQueue = writeQueue
    .then(() => writeExpensesSync(expenses))
    .catch((err) => {
      console.error('[FileStorage] Write Queue Error:', err.message);
      throw err;
    });
  return writeQueue;
}

module.exports = {
  readExpenses,
  writeExpenses,
  writeExpensesSync,
  setStoragePath,
  getStoragePath,
};
