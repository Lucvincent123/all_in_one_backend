// Import prebuilt modules
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

export default new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

// Export the pool for use in other parts of the application
// export default pool;

export abstract class Table {
    protected pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    abstract createTable(): Promise<void>;

    abstract dropTable(): Promise<void>;

    abstract insertData(data: any[]): Promise<void> | Promise<any>;

    abstract getData(): Promise<any[] | void>;
}
