import { Pool } from 'pg';
import path from 'path';

import pool, { Table } from '../';
import { getQueryByName } from '../../utils/sql';
import { errorHandler } from '../../utils/error';

const filePath = path.join(__dirname, 'expense.query.sql');

type Expense = {
    id?: number;
    circleId: number;
    amount: number;
    title: string;
    expense_date?: string;
};

class ExpenseTable extends Table {
    constructor(pool: Pool) {
        super(pool);
    }

    async createTable(): Promise<void> {
        try {
            const query = await getQueryByName(filePath, 'create_expense_table');
            await this.pool.query(query);
        } catch (error: any) {
            console.error('Error creating expense table -', error.message);
            errorHandler(error);
        }
    }

    async dropTable(): Promise<void> {
        try {
            const query = await getQueryByName(filePath, 'drop_expense_table');
            await this.pool.query(query);
        } catch (error: any) {
            console.error('Error dropping expense table -', error.message);
            errorHandler(error);
        }
    }

    async insertData(data: Expense[]): Promise<number[] | void> {
        try {
            const query = await getQueryByName(filePath, 'insert_expense_data');
            const ids: number[] = [];
            for (const item of data) {
                const id = await this.pool.query(query, [item.circleId, item.amount, item.title, item.expense_date]);
                ids.push(id.rows[0].id);
            }
            return ids;
        } catch (error: any) {
            console.error('Error inserting data into expense table -', error.message);
            errorHandler(error);
        }
    }

    async getData(): Promise<Expense[] | void> {
        try {
            const query = await getQueryByName(filePath, 'select_all_expenses');
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error: any) {
            console.error('Error fetching data from expense table -', error.message);
            errorHandler(error);
        }
    }

    async getDataByCircleId(circleId: number): Promise<Expense[] | void> {
        try {
            const query = await getQueryByName(filePath, 'select_all_expenses_by_circle_id');
            const result = await this.pool.query(query, [circleId]);
            return result.rows;
        } catch (error: any) {
            console.error('Error fetching data by circle id from expense table -', error.message);
            errorHandler(error);
        }
    }
}

export default new ExpenseTable(pool);
