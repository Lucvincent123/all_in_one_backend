import { Pool } from 'pg';
import path from 'path';

import pool, { Table } from '../';
import { getQueryByName } from '../../utils/sql';
import { errorHandler } from '../../utils/error';

const filePath = path.join(__dirname, 'payment.query.sql');

type Payment = {
    userId: number;
    expenseId: number;
    amount: number;
};

class PaymentTable extends Table {
    constructor(pool: Pool) {
        super(pool);
    }

    async createTable(): Promise<void> {
        try {
            const query = await getQueryByName(filePath, 'create_payment_table');
            await this.pool.query(query);
        } catch (error: any) {
            console.error('Error creating payment table -', error.message);
            errorHandler(error);
        }
    }

    async dropTable(): Promise<void> {
        try {
            const query = await getQueryByName(filePath, 'drop_payment_table');
            await this.pool.query(query);
        } catch (error: any) {
            console.error('Error dropping payment table -', error.message);
            errorHandler(error);
        }
    }

    async insertData(data: Payment[]): Promise<void> {
        try {
            const query = await getQueryByName(filePath, 'insert_payment_data');
            for (const item of data) {
                await this.pool.query(query, [item.userId, item.expenseId, item.amount]);
            }
        } catch (error: any) {
            console.error('Error inserting data into payment table -', error.message);
            errorHandler(error);
        }
    }

    async getData(): Promise<Payment[] | void> {
        try {
            const query = await getQueryByName(filePath, 'select_all_payments');
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error: any) {
            console.error('Error fetching data from payment table -', error.message);
            errorHandler(error);
        }
    }

    async getDataByExpenseId(expenseId: number): Promise<Payment[] | void> {
        try {
            const query = await getQueryByName(filePath, 'select_all_payments_by_expenseId');
            const result = await this.pool.query(query, [expenseId]);
            return result.rows;
        } catch (error: any) {
            console.error('Error fetching data by expenseId from payment table -', error.message);
            errorHandler(error);
        }
    }
}

export default new PaymentTable(pool);
