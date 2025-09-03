// Import
import { Router } from 'express';

// Controllers
import { circleMemberController } from '../controllers';

// Init
const router = Router();

// Mapping
router.post('/create', circleMemberController.createCircleMembersTable);
router.get('/', circleMemberController.getAllCircleMembers);
router.post('/', circleMemberController.createCircleMember);
router.delete('/drop', circleMemberController.dropCircleMembersTable);

router.get('/:userId', circleMemberController.getAllCircles);
router.get('/circle/:circleId', circleMemberController.getAllMembersOfCircle);
router.get('/add-member/:circleId', circleMemberController.getAllMembersNotInCircle);
router.post('/add-member/:circleId', circleMemberController.createCircleMembers);

// Export
export default router;
