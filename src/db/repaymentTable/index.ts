import { Pool } from 'pg';

import pool, { Table } from '../';
import { errorHandler } from '../../utils/error';
import * as queryString from './query';

type Repayment = {
    id?: number;
    sender: number;
    receiver: number;
    circleId: number;
    amount: number;
    repayment_date: string;
    title: string;
};

type RepaymentWithUser = {
    repayment_id: number;
    circle_id: number;
    amount: string;
    repayment_date: string;
    title: string;
    sender_id: number;
    sender_username: string;
    sender_email: string;
    receiver_id: number;
    receiver_username: string;
    receiver_email: string;
};

class repaymentTable extends Table {
    constructor(pool: Pool) {
        super(pool);
    }

    async createTable(): Promise<void> {
        try {
            const query = queryString.create_repayment_table;
            await this.pool.query(query);
        } catch (error: any) {
            console.error('Error creating repayment table -', error.message);
            errorHandler(error);
        }
    }

    async dropTable(): Promise<void> {
        try {
            const query = queryString.drop_repayment_table;
            await this.pool.query(query);
        } catch (error: any) {
            console.error('Error dropping repayment table -', error.message);
            errorHandler(error);
        }
    }

    async insertData(data: Repayment[]): Promise<void> {
        try {
            const query = queryString.insert_repayment_data;
            for (const item of data) {
                await this.pool.query(query, [
                    item.sender,
                    item.receiver,
                    item.circleId,
                    item.amount,
                    item.repayment_date,
                    item.title,
                ]);
            }
        } catch (error: any) {
            console.error('Error inserting data into repayment table -', error.message);
            errorHandler(error);
        }
    }

    async getData(): Promise<Repayment[] | void> {
        try {
            const query = queryString.select_all_repayments;
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error: any) {
            console.error('Error fetching data from repayment table -', error.message);
            errorHandler(error);
        }
    }

    async getDataByCircleId(circleId: number): Promise<RepaymentWithUser[] | void> {
        try {
            const query = queryString.select_repayments_by_circle_id;
            const result = await this.pool.query(query, [circleId]);
            return result.rows;
        } catch (error: any) {
            console.error('Error fetching data from repayment table -', error.message);
            errorHandler(error);
        }
    }
}

export default new repaymentTable(pool);
