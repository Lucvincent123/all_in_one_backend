// Import
import { Router } from 'express';

// Controllers
import { repaymentController } from '../controllers';

// Init
const router = Router();

// Mapping
router.post('/create', repaymentController.createRepaymentTable);
router.get('/', repaymentController.getAllRepayments);
router.post('/', repaymentController.createRepayment);
router.delete('/drop', repaymentController.dropRepaymentTable);
router.get('/:circleId', repaymentController.getRepaymentsByCircleId);

// Export
export default router;
