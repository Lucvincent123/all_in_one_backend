// Import
import { Router } from 'express';

// Controllers
import { debtController } from '../controllers';

// Init
const router = Router();

// Mapping
router.post('/create', debtController.createDebtTable);
router.get('/', debtController.getAllDebts);
router.post('/', debtController.createDebt);
router.delete('/drop', debtController.dropDebtTable);
router.get('/expense', debtController.getDataByExpenseId);

// Export
export default router;
