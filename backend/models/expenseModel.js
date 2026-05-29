const db = require('../config/db');

const createExpense = async (userId, category, amount, datetime, refNumber, billUrl, notes) => {
  const result = await db.query(
    'INSERT INTO expenses (user_id, category, amount, datetime, reference_number, bill_url, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [userId, category, amount, datetime, refNumber, billUrl, notes]
  );
  return result.rows[0];
};

const getExpensesByUserId = async (userId) => {
  const result = await db.query('SELECT * FROM expenses WHERE user_id = $1 ORDER BY datetime DESC', [userId]);
  return result.rows;
};

const getAllExpenses = async () => {
  const result = await db.query(`
    SELECT e.*, u.name as employee_name, u.email as employee_email 
    FROM expenses e 
    JOIN users u ON e.user_id = u.id 
    ORDER BY e.datetime DESC
  `);
  return result.rows;
};

const updateExpenseStatus = async (expenseId, status) => {
  const result = await db.query(
    'UPDATE expenses SET status = $1 WHERE id = $2 RETURNING *',
    [status, expenseId]
  );
  return result.rows[0];
};

const updateExpense = async (id, category, amount, datetime, refNumber, notes) => {
  const result = await db.query(
    'UPDATE expenses SET category = $1, amount = $2, datetime = $3, reference_number = $4, notes = $5 WHERE id = $6 RETURNING *',
    [category, amount, datetime, refNumber, notes, id]
  );
  return result.rows[0];
};

const deleteExpense = async (id) => {
  await db.query('DELETE FROM expenses WHERE id = $1', [id]);
};

const payExpense = async (id, notesStr) => {
  const result = await db.query(
    'UPDATE expenses SET status = $1, notes = $2 WHERE id = $3 RETURNING *',
    ['Paid', notesStr, id]
  );
  return result.rows[0];
};

module.exports = {
  createExpense,
  getExpensesByUserId,
  getAllExpenses,
  updateExpenseStatus,
  updateExpense,
  deleteExpense,
  payExpense
};
