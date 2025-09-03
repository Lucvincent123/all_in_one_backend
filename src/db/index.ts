// Import prebuilt modules
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

export default new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false,
    },
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
