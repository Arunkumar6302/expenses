const { createExpense, getExpensesByUserId, getAllExpenses, updateExpenseStatus, updateExpense, deleteExpense } = require('../models/expenseModel');
const db = require('../config/db'); // For user lookup

const addExpense = async (req, res) => {
  try {
    const { category, amount, datetime, reference_number, notes } = req.body;
    const bill_url = req.file ? `/uploads/${req.file.filename}` : null;
    const expense = await createExpense(req.user.id, category, amount, datetime, reference_number, bill_url, notes);
    
    // Fetch user name for notification
    const userRes = await db.query('SELECT name FROM users WHERE id = $1', [req.user.id]);
    const userName = userRes.rows[0]?.name || 'An employee';

    // Emit socket event to managers
    const io = req.app.get('io');
    io.to('managers').emit('new_expense', {
      message: `${userName} has added a new expense for $${amount}.`,
      expense
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Server error adding expense' });
  }
};

const getMyExpenses = async (req, res) => {
  try {
    const expenses = await getExpensesByUserId(req.user.id);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching expenses' });
  }
};

const getManagerExpenses = async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const expenses = await getAllExpenses();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching all expenses' });
  }
};

const updateStatus = async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const { id } = req.params;
    const { status } = req.body;
    const updated = await updateExpenseStatus(id, status);

    // Emit socket event to the specific employee who owns the expense
    if (updated && updated.user_id) {
      const io = req.app.get('io');
      io.to(`user_${updated.user_id}`).emit('expense_status_update', {
        message: `Your expense for $${updated.amount} has been marked as ${status}.`,
        expense: updated
      });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating expense status' });
  }
};

const updateExpenseFull = async (req, res) => {
  try {
    if (req.user.role !== 'manager') return res.status(403).json({ error: 'Access denied' });
    const { id } = req.params;
    const { category, amount, datetime, reference_number, notes } = req.body;
    const updated = await updateExpense(id, category, amount, datetime, reference_number, notes);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating expense' });
  }
};

const deleteExpenseData = async (req, res) => {
  try {
    if (req.user.role !== 'manager') return res.status(403).json({ error: 'Access denied' });
    const { id } = req.params;
    await deleteExpense(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting expense' });
  }
};

const processPayment = async (req, res) => {
  try {
    if (req.user.role !== 'manager') return res.status(403).json({ error: 'Access denied' });
    const { id } = req.params;
    const { paymentDetails } = req.body;
    
    const existing = await db.query('SELECT * FROM expenses WHERE id = $1', [id]);
    const exp = existing.rows[0];
    
    const mgr = await db.query('SELECT name FROM users WHERE id = $1', [req.user.id]);
    const managerName = mgr.rows[0].name;

    const newNotes = `${exp.notes || ''}\n\n[PAYMENT DETAILS]\nProcessed by Manager: ${managerName}\nPayment Method: ${paymentDetails.method}\nCard Ending: ${paymentDetails.card.slice(-4)}\nTransaction Date: ${new Date().toLocaleString()}`;
    
    const { payExpense } = require('../models/expenseModel');
    const updated = await payExpense(id, newNotes);

    if (updated && updated.user_id) {
      const io = req.app.get('io');
      io.to(`user_${updated.user_id}`).emit('expense_status_update', {
        message: `Your expense for $${updated.amount} has been successfully paid by ${managerName}.`,
        expense: updated
      });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error processing payment' });
  }
};

module.exports = {
  addExpense,
  getMyExpenses,
  getManagerExpenses,
  updateStatus,
  updateExpenseFull,
  deleteExpenseData,
  processPayment
};
