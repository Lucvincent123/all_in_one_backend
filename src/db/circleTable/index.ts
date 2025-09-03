import { Pool } from 'pg';

import pool, { Table } from '../';
import { errorHandler } from '../../utils/error';
import * as queryString from './query';

type Circle = {
    id?: number;
    title: string;
};

class CircleTable extends Table {
    constructor(pool: Pool) {
        super(pool);
    }

    async createTable(): Promise<void> {
        try {
            const query = queryString.create_circles_table;
            await this.pool.query(query);
        } catch (error: any) {
            console.error('Error creating circles table -', error.message);
            errorHandler(error);
        }
    }

    async dropTable(): Promise<void> {
        try {
            const query = queryString.drop_circles_table;
            await this.pool.query(query);
        } catch (error: any) {
            console.error('Error dropping circles table -', error.message);
            errorHandler(error);
        }
    }

    async insertData(data: Circle[]): Promise<any> {
        try {
            const ids: number[] = [];
            const query = queryString.insert_circles_data;
            for (const item of data) {
                const result = await this.pool.query(query, [item.title]);
                ids.push(result.rows[0].id);
            }
            return ids;
        } catch (error: any) {
            console.error('Error inserting data into circles table -', error.message);
            errorHandler(error);
        }
    }

    async getData(): Promise<Circle[] | void> {
        try {
            const query = queryString.select_all_circles;
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error: any) {
            console.error('Error fetching data from circles table -', error.message);
            errorHandler(error);
        }
    }
}

export default new CircleTable(pool);
