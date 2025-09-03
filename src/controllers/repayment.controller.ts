import { Response, Request } from 'express';

import repaymentTable from '../db/repaymentTable';
import circleMemberTable from '../db/circleMemberTable';

class RepaymentController {
    async createRepaymentTable(req: Request, res: Response): Promise<void> {
        try {
            await repaymentTable.createTable();
            res.status(201).json({ success: true, message: 'Repayment table created successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to create repayment table' });
        }
    }

    async getAllRepayments(req: Request, res: Response): Promise<void> {
        try {
            const repayments = await repaymentTable.getData();
            res.status(200).json({ success: true, payload: repayments });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to fetch repayments' });
        }
    }

    async createRepayment(req: Request, res: Response): Promise<void> {
        const { sender, receiver, circleId, amount, title } = req.body;
        if (!sender || !receiver || !circleId || !amount || !title) {
            res.status(400).json({ success: false, message: 'sender, receiver, circleId, amount, title are required' });
        }
        try {
            await Promise.all([
                circleMemberTable.updateMemberBalance(amount, sender, circleId),
                circleMemberTable.updateMemberBalance(-amount, receiver, circleId),
            ]);
            const newRepayment = {
                sender,
                receiver,
                circleId,
                amount,
                title,
                repayment_date: new Date().toISOString(),
            };
            await repaymentTable.insertData([newRepayment]);
            res.status(201).json({ success: true, message: 'Repayment created successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to create repayment' });
        }
    }

    async dropRepaymentTable(req: Request, res: Response): Promise<void> {
        try {
            await repaymentTable.dropTable();
            res.status(200).json({ success: true, message: 'Repayment table dropped successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to drop repayment table' });
        }
    }

    async getRepaymentsByCircleId(req: Request, res: Response): Promise<void> {
        try {
            const { circleId } = req.params;
            const repayments = await repaymentTable.getDataByCircleId(Number(circleId));
            if (!repayments) throw new Error();
            const payload = repayments.map((repayment) => {
                return {
                    id: repayment.repayment_id,
                    sender: {
                        id: repayment.sender_id,
                        username: repayment.sender_username,
                        email: repayment.sender_email,
                    },
                    receiver: {
                        id: repayment.receiver_id,
                        username: repayment.receiver_username,
                        email: repayment.receiver_email,
                    },
                    amount: repayment.amount,
                    date: repayment.repayment_date,
                    description: repayment.title,
                };
            });
            res.status(200).json({ success: true, payload });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch repayments of circle id',
            });
        }
    }
}

export default new RepaymentController();
