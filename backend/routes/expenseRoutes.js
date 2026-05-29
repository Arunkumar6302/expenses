const express = require('express');
const { addExpense, getMyExpenses, getManagerExpenses, updateStatus, updateExpenseFull, deleteExpenseData, processPayment } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, upload.single('bill'), addExpense)
  .get(protect, getMyExpenses);

router.get('/all', protect, getManagerExpenses);
router.put('/:id/status', protect, updateStatus);
router.put('/:id/pay', protect, processPayment);
router.put('/:id', protect, updateExpenseFull);
router.delete('/:id', protect, deleteExpenseData);

module.exports = router;
