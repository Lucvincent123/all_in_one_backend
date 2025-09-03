import { Pool } from 'pg';

import pool, { Table } from '../';
import { errorHandler } from '../../utils/error';
import * as queryString from './query';

type CircleMember = {
    userId: number;
    circleId: number;
    balance?: number;
};

class CircleMemberTable extends Table {
    constructor(pool: Pool) {
        super(pool);
    }

    async createTable(): Promise<void> {
        try {
            const query = queryString.create_members_table;
            await this.pool.query(query);
        } catch (error: any) {
            console.error('Error creating circle members table -', error.message);
            errorHandler(error);
        }
    }

    async dropTable(): Promise<void> {
        try {
            const query = queryString.drop_members_table;
            await this.pool.query(query);
        } catch (error: any) {
            console.error('Error dropping circle members table -', error.message);
            errorHandler(error);
        }
    }

    async insertData(data: CircleMember[]): Promise<void> {
        try {
            const query = queryString.insert_members_data;
            for (const item of data) {
                await this.pool.query(query, [item.userId, item.circleId]);
            }
        } catch (error: any) {
            console.error('Error inserting data into circle members table -', error.message);
            errorHandler(error);
        }
    }

    async getData(): Promise<CircleMember[] | void> {
        try {
            const query = queryString.select_all_members;
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error: any) {
            console.error('Error fetching data from circles table -', error.message);
            errorHandler(error);
        }
    }

    async getAllCircles(userId: number): Promise<{ circleId: number; title: string; balance: number }[] | void> {
        try {
            const query = queryString.select_all_circles;
            const result = await this.pool.query(query, [userId]);
            return result.rows;
        } catch (error: any) {
            console.error('Error fetching data from circles, members table -', error.message);
            errorHandler(error);
        }
    }

    async getAllMembersOfCircle(
        circleId: number,
    ): Promise<{ userId: number; username: string; email: string; balance: number }[] | void> {
        try {
            const query = queryString.select_all_members_of_circle;
            const result = await this.pool.query(query, [circleId]);
            return result.rows;
        } catch (error: any) {
            console.error('Error fetching members of the circle -', error.message);
            errorHandler(error);
        }
    }

    async getAllMembersNotInCircle(
        circleId: number,
    ): Promise<{ userId: number; username: string; email: string }[] | void> {
        try {
            const query = queryString.select_all_members_not_in_circle;
            const result = await this.pool.query(query, [circleId]);
            return result.rows;
        } catch (error: any) {
            console.error('Error fetching members not in the circle -', error.message);
            errorHandler(error);
        }
    }

    async updateMemberBalance(amount: number, userId: number, circleId: number): Promise<void> {
        try {
            const query = queryString.update_member_balance;
            await this.pool.query(query, [amount, userId, circleId]);
        } catch (error: any) {
            console.error('Error updating member balance -', error.message);
            errorHandler(error);
        }
    }
}

export default new CircleMemberTable(pool);
