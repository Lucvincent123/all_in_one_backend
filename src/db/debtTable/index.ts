import { Pool } from 'pg';
import path from 'path';

import pool, { Table } from '../';
import { getQueryByName } from '../../utils/sql';
import { errorHandler } from '../../utils/error';

const filePath = path.join(__dirname, 'debt.query.sql');

type Debt = {
    userId: number;
    expenseId: number;
    amount: number;
};

class DebtTable extends Table {
    constructor(pool: Pool) {
        super(pool);
    }

    async createTable(): Promise<void> {
        try {
            const query = await getQueryByName(filePath, 'create_debt_table');
            await this.pool.query(query);
        } catch (error: any) {
            console.error('Error creating expense table -', error.message);
            errorHandler(error);
        }
    }

    async dropTable(): Promise<void> {
        try {
            const query = await getQueryByName(filePath, 'drop_debt_table');
            await this.pool.query(query);
        } catch (error: any) {
            console.error('Error dropping debt table -', error.message);
            errorHandler(error);
        }
    }

    async insertData(data: Debt[]): Promise<void> {
        try {
            const query = await getQueryByName(filePath, 'insert_debt_data');
            for (const item of data) {
                await this.pool.query(query, [item.userId, item.expenseId, item.amount]);
            }
        } catch (error: any) {
            console.error('Error inserting data into debt table -', error.message);
            errorHandler(error);
        }
    }

    async getData(): Promise<Debt[] | void> {
        try {
            const query = await getQueryByName(filePath, 'select_all_debts');
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error: any) {
            console.error('Error fetching data from debt table -', error.message);
            errorHandler(error);
        }
    }

    async getDataByExpenseId(expenseId: number): Promise<Debt[] | void> {
        try {
            const query = await getQueryByName(filePath, 'select_all_debts_by_expenseId');
            const result = await this.pool.query(query, [expenseId]);
            return result.rows;
        } catch (error: any) {
            console.error('Error fetching data from debt table -', error.message);
            errorHandler(error);
        }
    }
}

export default new DebtTable(pool);
