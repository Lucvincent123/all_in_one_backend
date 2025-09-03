import { Request, Response } from 'express';

import circleTable from '../db/circleTable';
import repaymentTable from '../db/repaymentTable';

class CircleController {
    async createCircleTable(req: Request, res: Response): Promise<void> {
        try {
            await circleTable.createTable();
            res.status(201).json({ success: true, message: 'Circles table created successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to create circles table' });
        }
    }

    async getAllCircles(req: Request, res: Response): Promise<void> {
        try {
            const circles = await circleTable.getData();
            res.status(200).json({ success: true, payload: circles });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to fetch circles' });
        }
    }

    async createCircle(req: Request, res: Response): Promise<void> {
        const { title } = req.body;
        if (!title) {
            res.status(400).json({ success: false, message: 'Title is required' });
        }
        try {
            const newCircle = { title };
            const ids = await circleTable.insertData([newCircle]);
            res.status(201).json({ success: true, message: 'Circle created successfully', payload: ids[0] });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to create circle' });
        }
    }

    async dropCirclesTable(req: Request, res: Response): Promise<void> {
        try {
            await circleTable.dropTable();
            res.status(200).json({ success: true, message: 'Circles table dropped successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to drop circles table' });
        }
    }
}

export default new CircleController();
