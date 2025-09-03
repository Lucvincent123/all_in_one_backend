// Import
import { Router } from 'express';

// Controllers
import { paymentController } from '../controllers';

// Init
const router = Router();

// Mapping
router.post('/create', paymentController.createPaymentTable);
router.get('/', paymentController.getAllPayments);
router.post('/', paymentController.createPayment);
router.delete('/drop', paymentController.dropPaymentTable);
router.get('/expense', paymentController.getDataByExpenseId);

// Export
export default router;
