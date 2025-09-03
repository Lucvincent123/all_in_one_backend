// Import
import { Router } from 'express';

// Controllers
import { expenseController } from '../controllers';

// Init
const router = Router();

// Mapping
router.post('/create', expenseController.createExpenseTable);
router.get('/', expenseController.getAllExpenses);
router.post('/', expenseController.createExpense);
router.delete('/drop', expenseController.dropExpenseTable);
router.get('/circle', expenseController.getDataByCircleId);
router.get('/:circleId', expenseController.getExpensesByCircleId);

// Export
export default router;
