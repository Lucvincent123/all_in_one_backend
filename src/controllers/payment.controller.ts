import { Response, Request } from 'express';

import paymentTable from '../db/paymentTable';

class PaymentController {
    async createPaymentTable(req: Request, res: Response): Promise<void> {
        try {
            await paymentTable.createTable();
            res.status(201).json({ success: true, message: 'Payment table created successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to create payment table' });
        }
    }

    async getAllPayments(req: Request, res: Response): Promise<void> {
        try {
            const payments = await paymentTable.getData();
            res.status(200).json({ success: true, payload: payments });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to fetch payments' });
        }
    }

    async createPayment(req: Request, res: Response): Promise<void> {
        const { userId, expenseId, amount } = req.body;
        if (!userId || !expenseId || !amount) {
            res.status(400).json({ success: false, message: 'userId, expenseId, amount are required' });
            return;
        }
        try {
            const newPayment = { userId, expenseId, amount };
            await paymentTable.insertData([newPayment]);
            res.status(201).json({ success: true, message: 'Payment created successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to create payment' });
        }
    }

    async dropPaymentTable(req: Request, res: Response): Promise<void> {
        try {
            await paymentTable.dropTable();
            res.status(200).json({ success: true, message: 'Payment table dropped successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to drop payment table' });
        }
    }

    async getDataByExpenseId(req: Request, res: Response): Promise<void> {
        try {
            const { expenseId } = req.body;
            const payments = await paymentTable.getDataByExpenseId(expenseId);
            res.status(200).json({ success: true, payload: payments });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to fetch payments' });
        }
    }
}

export default new PaymentController();
