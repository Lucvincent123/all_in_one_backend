import { Response, Request } from 'express';

import expenseTable from '../db/expenseTable';
import paymentTable from '../db/paymentTable';
import debtTable from '../db/debtTable';
import circleMemberTable from '../db/circleMemberTable';
import { log } from 'console';

class ExpenseController {
    async createExpenseTable(req: Request, res: Response): Promise<void> {
        try {
            await expenseTable.createTable();
            res.status(201).json({ success: true, message: 'Expense table created successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to create expense table' });
        }
    }

    async getAllExpenses(req: Request, res: Response): Promise<void> {
        try {
            const expenses = await expenseTable.getData();
            res.status(200).json({ success: true, payload: expenses });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to fetch expenses' });
        }
    }

    async createExpense(req: Request, res: Response): Promise<void> {
        const { circleId, amount, title, payments, debts } = req.body;
        if (!circleId || !amount || !title) {
            res.status(400).json({ success: false, message: 'circleId, amount, title are required' });
        }
        try {
            const newExpense = { circleId, amount, title, expense_date: new Date().toISOString() };
            const ids = await expenseTable.insertData([newExpense]);
            if (!ids || ids.length === 0) throw new Error('Failed to create expense');
            const expenseId = ids[0];
            if (payments && payments.length > 0) {
                const paymentData = await Promise.all(
                    payments.map(async (payment: { userId: number; amount: number }) => {
                        await circleMemberTable.updateMemberBalance(payment.amount, payment.userId, circleId);
                        return {
                            userId: payment.userId,
                            expenseId,
                            amount: payment.amount,
                        };
                    }),
                );
                console.log(paymentData);
                await paymentTable.insertData(paymentData);
            }
            if (debts && debts.length > 0) {
                const debtData = await Promise.all(
                    debts.map(async (debt: { userId: number; amount: number }) => {
                        await circleMemberTable.updateMemberBalance(-debt.amount, debt.userId, circleId);
                        return {
                            userId: debt.userId,
                            expenseId,
                            amount: debt.amount,
                        };
                    }),
                );
                await debtTable.insertData(debtData);
            }

            res.status(201).json({ success: true, message: 'Expense created successfully', payload: ids });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to create expense' });
        }
    }

    async dropExpenseTable(req: Request, res: Response): Promise<void> {
        try {
            await expenseTable.dropTable();
            res.status(200).json({ success: true, message: 'Expense table dropped successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to drop expense table' });
        }
    }

    async getDataByCircleId(req: Request, res: Response): Promise<void> {
        try {
            const { circleId } = req.body;
            const expenses = await expenseTable.getDataByCircleId(circleId);
            res.status(200).json({ success: true, payload: expenses });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to fetch expenses' });
        }
    }

    async getExpensesByCircleId(req: Request, res: Response): Promise<void> {
        try {
            const { circleId } = req.params;
            const expenses = await expenseTable.getDataByCircleId(Number(circleId));
            if (!expenses) throw new Error();
            if (expenses.length === 0) {
                res.status(200).json({ success: true, payload: expenses });
                return;
            }
            const allTasks = expenses.map((expense) => {
                if (!expense.id) throw new Error();
                return Promise.all([
                    paymentTable.getDataByExpenseId(expense.id),
                    debtTable.getDataByExpenseId(expense.id),
                ]);
            });

            const groupedResults = await Promise.all(allTasks);
            const payload = expenses.map((expense, index) => {
                return {
                    id: expense.id,
                    circleId: expense.circleId,
                    amount: expense.amount,
                    description: expense.title,
                    date: expense.expense_date,
                    payments: groupedResults[index][0],
                    debts: groupedResults[index][1],
                };
            });
            res.status(200).json({ success: true, payload });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to fetch expenses' });
        }
    }
}

export default new ExpenseController();
