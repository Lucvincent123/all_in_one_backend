import { Pool } from 'pg';
import path from 'path';

import pool, { Table } from '../';
import { getQueryByName } from '../../utils/sql';
import { errorHandler } from '../../utils/error';

const filePath = path.join(__dirname, 'user.query.sql');

interface User {
    id?: number; // Optional for inserts
    name: string;
    email: string;
    password_hash?: string;
}

class UserTable extends Table {
    constructor(pool: Pool) {
        super(pool);
    }

    async createTable(): Promise<void> {
        try {
            const query = await getQueryByName(filePath, 'create_users_table');
            await this.pool.query(query);
        } catch (error: any) {
            console.error('Error creating users table -', error.message);
            errorHandler(error);
        }
    }

    async dropTable(): Promise<void> {
        try {
            const query = await getQueryByName(filePath, 'drop_users_table');
            await this.pool.query(query);
        } catch (error: any) {
            console.error('Error dropping users table -', error.message);
            errorHandler(error);
        }
    }

    async insertData(data: User[]): Promise<void> {
        try {
            const query = await getQueryByName(filePath, 'insert_users_data');
            for (const item of data) {
                await this.pool.query(query, [item.name, item.email, item.password_hash]);
            }
        } catch (error: any) {
            console.error('Error inserting data into users table -', error.message);
            errorHandler(error); 
        }
    }

    async getData(): Promise<User[] | void> {
        try {
            const query = await getQueryByName(filePath, 'select_all_users');
            const result = await this.pool.query(query);
            return result.rows;
        } catch (error: any) {
            console.error('Error fetching data from users table -', error.message);
            errorHandler(error); 
        }
    }

    async getIdPasswordHashByEmail(email: string): Promise<{ id: number; password_hash: string } | null> {
        try {
            const query = await getQueryByName(filePath, 'select_id_password_hash_by_email');
            const result = await this.pool.query(query, [email]);
            return result.rows.length > 0
                ? { id: result.rows[0].id, password_hash: result.rows[0].password_hash }
                : null;
        } catch (error: any) {
            console.error('Error fetching password hash by email -', error.message);
            errorHandler(error);
            return null;
        }
    }
}

export default new UserTable(pool);
