import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import userTable from '../db/userTable';

class UserController {
    async createUserTable(req: Request, res: Response): Promise<void> {
        try {
            await userTable.createTable();
            res.status(201).json({ success: true, message: 'Users table created successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to create users table' });
        }
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await userTable.getData();
            res.status(200).json({ success: true, payload: users });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to fetch users' });
        }
    }

    async createUser(req: Request, res: Response): Promise<void> {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: 'Name, email, and password are required' });
        }
        try {
            const password_hash = await bcrypt.hash(password, 10);
            const newUser = { name, email, password_hash };
            await userTable.insertData([newUser]);
            res.status(201).json({ success: true, message: 'User created successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to create user' });
        }
    }

    async dropUserTable(req: Request, res: Response): Promise<void> {
        try {
            await userTable.dropTable();
            res.status(200).json({ success: true, message: 'Users table dropped successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to drop users table' });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required' });
            return;
        }
        try {
            const user = await userTable.getIdPasswordHashByEmail(email);
            if (!user) {
                res.status(404).json({ success: false, message: 'User not found' });
                return;
            }
            const { id, password_hash } = user;
            const isPasswordValid = await bcrypt.compare(password, password_hash);
            if (!isPasswordValid) {
                res.status(401).json({ success: false, message: 'Invalid password' });
                return;
            }
            const token = jwt.sign({ id, email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
            res.status(200).json({
                success: true,
                message: 'Login successful',
                token,
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to login' });
        }
    }
}

export default new UserController();
