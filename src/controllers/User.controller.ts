import { Request, Response, NextFunction } from 'express';
import { Logger } from '../library/Logging.library';
import { createUser, validateUser } from '../services/User.service';
import { verifyEmail } from '../utils/sendEmail.util';
import Token from './token.controller';
import UserModel from '../models/User.model';

class User extends Token {
    public async register(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await createUser(req.body);
            verifyEmail(req, res, next, user);
        } catch (error) {
            Logger.error(error);
            next(error);
        }
    }
    public async verify(req: Request, res: Response, next: NextFunction) {
        try {
            const token: string = req.params.token as string;
            const user = await validateUser(token);
            res.status(200).json({ success: true, message: 'User verified successfully', username: user.data.username });
        } catch (error) {
            Logger.error(error);
            next(error);
        }
    }
    public get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await UserModel.findById(req.params.id);
            res.status(200).json({ status: true, user });
        } catch (error) {
            next(error);
        }
    };
}

export default User;
