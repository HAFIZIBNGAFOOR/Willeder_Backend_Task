import { Request, Response, NextFunction } from 'express';
import { updateAccountUser, updatePasswordUser } from './account.service';
import { logger } from 'firebase-functions/v1';
import { getUser } from '../../../models/user';

export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId,email, name, phone, address } = req.body;
        await updateAccountUser(userId,email,name,phone,address)
        res.status(200).json('User updated Successfully')
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, password } = req.body;
        await updatePasswordUser(userId,password)
        res.status(200).json('User updated Successfully')
    } catch (error) {
        logger.error(error);
        next(error); 
    }

};

export const getAccountInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user_id } = req.user 
        const user = await getUser(user_id as string)
        res.status(200).json(user)
    } catch (error) {
        logger.error(error);
        next(error); 
    }
};
