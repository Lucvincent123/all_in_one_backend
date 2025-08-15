// Import
import { Router } from 'express';

// Controllers
import { userController } from '../controllers';

// Init
const router = Router();

// Mapping
router.post('/create', userController.createUserTable);
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.delete('/drop', userController.dropUserTable);
router.post('/login', userController.login);

// Export
export default router;
