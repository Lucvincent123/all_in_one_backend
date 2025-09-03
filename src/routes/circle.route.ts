// Import
import { Router } from 'express';

// Controllers
import { circleController } from '../controllers';

// Init
const router = Router();

// Mapping
router.post('/create', circleController.createCircleTable);
router.get('/', circleController.getAllCircles);
router.post('/', circleController.createCircle);
router.delete('/drop', circleController.dropCirclesTable);

// Export
export default router;
