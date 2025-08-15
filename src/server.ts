// Import necessary modules
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Import self-defined modules
import router from './routes';
import db from './db';

// Initialize the Express application
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1', router);

// Main
const port = (process.env.PORT as unknown as number) || 3000;
if (require.main === module) {
    app.listen(port, async () => {
        try {
            await db.connect();
            console.log(`Database connected successfully`);
        } catch (error: any) {
            console.error(`Failed to connect to the database -${error.message}`);
            process.exit(1);
        }
        console.log(`Server is listening on port ${port}`);
    });
}
