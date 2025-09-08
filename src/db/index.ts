// Import prebuilt modules
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

export default new Pool({
    // connectionString: process.env.DB_URL,
    // ssl: {
    //     rejectUnauthorized: false,
    // },
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
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
