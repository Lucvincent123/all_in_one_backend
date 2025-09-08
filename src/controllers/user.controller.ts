import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import userTable from '../db/userTable';
import { sendEmail } from '../utils/mail';

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
            return;
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
            console.log(isPasswordValid);
            if (!isPasswordValid) {
                res.status(401).json({ success: false, message: 'Invalid password' });
                return;
            }
            const token = jwt.sign({ userId: id, email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
            res.status(200).json({
                success: true,
                message: 'Login successful',
                token,
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to login' });
        }
    }

    async sendResetPasswordEmail(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ success: false, message: 'Email is required' });
            return;
        }
        try {
            const validUserId = await userTable.getIdByEmail(email);
            if (!validUserId) {
                res.status(404).json({ success: false, message: 'Email not found' });
                return;
            }
            const token = jwt.sign({ userId: validUserId, email }, process.env.JWT_SECRET as string, {
                expiresIn: '5m',
            });
            const url = `${process.env.FRONTEND_URI}/?token=${token}`;
            const message = `Click to reset\n${url}`;
            await sendEmail({
                email,
                message,
                subject: 'RESET PASSWORD',
                html: `
                <a href=${url}>Click here to reset password!</a>
                `,
            });
            res.status(200).json({ success: true, message: 'Email sent', token });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ success: false, message: error.message });
            }
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        const { newPassword } = req.body;
        console.log(newPassword);
        const userId = req.userId;
        console.log(userId);
        const email = req.email;
        console.log(email);
        if (!newPassword) {
            res.status(400).json({ success: false, message: 'New password, user ID, and email are required' });
            return;
        }
        try {
            const password_hash = await bcrypt.hash(newPassword, 10);
            await userTable.updatePasswordById(password_hash, userId as number);
            res.status(200).json({ success: true, message: 'Password updated successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to update password' });
        }
    }

    async authenticate(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId;
            const user = await userTable.getUsernameEmailById(userId as number);
            if (user == null) {
                res.status(401).json({ success: false, message: 'Invalid token' });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Authenticated',
                payload: { id: userId, username: user?.username, email: user?.email },
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to authenticate' });
        }
    }
}

export default new UserController();
