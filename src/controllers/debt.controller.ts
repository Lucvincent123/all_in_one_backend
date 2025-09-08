import { Response, Request } from 'express';

import debtTable from '../db/debtTable';

class DebtController {
    async createDebtTable(req: Request, res: Response): Promise<void> {
        try {
            await debtTable.createTable();
            res.status(201).json({ success: true, message: 'debt table created successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to create debt table' });
        }
    }

    async getAllDebts(req: Request, res: Response): Promise<void> {
        try {
            const debts = await debtTable.getData();
            res.status(200).json({ success: true, payload: debts });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to fetch debts' });
        }
    }

    async createDebt(req: Request, res: Response): Promise<void> {
        const { userId, expenseId, amount } = req.body;
        if (!userId || !expenseId || !amount) {
            res.status(400).json({ success: false, message: 'userId, expenseId, amount are required' });
            return;
        }
        try {
            const newdebt = { userId, expenseId, amount };
            await debtTable.insertData([newdebt]);
            res.status(201).json({ success: true, message: 'debt created successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to create debt' });
        }
    }

    async dropDebtTable(req: Request, res: Response): Promise<void> {
        try {
            await debtTable.dropTable();
            res.status(200).json({ success: true, message: 'debt table dropped successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to drop debt table' });
        }
    }

    async getDataByExpenseId(req: Request, res: Response): Promise<void> {
        try {
            const { expenseId } = req.body;
            const debts = await debtTable.getDataByExpenseId(expenseId);
            res.status(200).json({ success: true, payload: debts });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to fetch debts' });
        }
    }
}

export default new DebtController();
