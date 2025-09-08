import { Request, Response } from 'express';
import circleMemberTable from '../db/circleMemberTable';

class CircleMemberController {
    async createCircleMembersTable(req: Request, res: Response): Promise<void> {
        try {
            await circleMemberTable.createTable();
            res.status(201).json({ success: true, message: 'Circle members table created successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to create circle members table' });
        }
    }

    async getAllCircleMembers(req: Request, res: Response): Promise<void> {
        try {
            const members = await circleMemberTable.getData();
            res.status(200).json({ success: true, payload: members });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to fetch circle members' });
        }
    }

    async createCircleMember(req: Request, res: Response): Promise<void> {
        const { userId, circleId } = req.body;
        if (!userId || !circleId) {
            res.status(400).json({ success: false, message: 'UserId and circleId are required' });
            return;
        }
        try {
            const newMember = { userId, circleId };
            await circleMemberTable.insertData([newMember]);
            res.status(201).json({ success: true, message: 'Circle members created successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to create circle members' });
        }
    }

    async createCircleMembers(req: Request, res: Response): Promise<void> {
        try {
            const { userIds }: { userIds: number[] } = req.body;
            const { circleId } = req.params;
            const members = userIds.map((userId) => {
                return { userId, circleId: Number(circleId) };
            });
            console.log(members);
            await circleMemberTable.insertData(members);
            res.status(201).json({ success: true, message: 'Circle members created successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to create circle members' });
        }
    }

    async dropCircleMembersTable(req: Request, res: Response): Promise<void> {
        try {
            await circleMemberTable.dropTable();
            res.status(200).json({ success: true, message: 'Circle members table dropped successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to drop circle members table' });
        }
    }

    async getAllCircles(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const circles = await circleMemberTable.getAllCircles(Number(userId));
            res.status(200).json({ success: true, payload: circles });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to get all circles' });
        }
    }

    async getAllMembersOfCircle(req: Request, res: Response): Promise<void> {
        try {
            const { circleId } = req.params;
            const members = await circleMemberTable.getAllMembersOfCircle(Number(circleId));
            res.status(200).json({ success: true, payload: members });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to get all members' });
        }
    }

    async getAllMembersNotInCircle(req: Request, res: Response): Promise<void> {
        try {
            const { circleId } = req.params;
            const members = await circleMemberTable.getAllMembersNotInCircle(Number(circleId));
            res.status(200).json({ success: true, payload: members });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to get all members not in the circles',
            });
        }
    }

    async updateMemberBalance(req: Request, res: Response): Promise<void> {
        try {
            const { amount, userId, circleId } = req.body;
            if (!amount || !userId || !circleId) {
                res.status(400).json({ success: false, message: 'amount, userId and circleId are required' });
                return;
            }
            await circleMemberTable.updateMemberBalance(amount, userId, circleId);
            res.status(200).json({ success: true, message: 'Member balance updated successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Failed to update member balance' });
        }
    }
}

export default new CircleMemberController();
