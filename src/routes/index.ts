import { Router } from 'express';

import userRouter from './user.route';
import circleRouter from './circle.route';
import circleMemberRouter from './circleMember.route';
import expenseRouter from './expense.route';
import paymentRouter from './payment.route';
import debtRouter from './debt.route';
import repaymentRouter from './repayment.route';

const router = Router();

router.use('/user', userRouter);
router.use('/circle', circleRouter);
router.use('/circle-member', circleMemberRouter);
router.use('/expense', expenseRouter);
router.use('/payment', paymentRouter);
router.use('/debt', debtRouter);
router.use('/repayment', repaymentRouter);

export default router;
