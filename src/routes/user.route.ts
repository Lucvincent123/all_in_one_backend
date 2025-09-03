// Import
import { Router } from 'express';

// Controllers
import { userController } from '../controllers';

// Middlewares
import { authorization } from '../middlewares/auth';

// Init
const router = Router();

// Mapping
router.post('/create', userController.createUserTable);
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.delete('/drop', userController.dropUserTable);
router.post('/login', userController.login);
router.post('/forgot-password', userController.sendResetPasswordEmail);
router.put('/reset-password', authorization, userController.resetPassword);
router.post('/authenticate', authorization, userController.authenticate);

// Export
export default router;
