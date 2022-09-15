import { refreshToken } from '../utils/accessToken.util';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User.model';
import Jwt from 'jsonwebtoken';

class Token {
    public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.token);
            const user: any = await User.findOne({ token: req.token });
            console.log(user);
            Jwt.verify(user.token, process.env.REFRESHTOKEN_SECRET as string, async (error: any, _decoded: any): Promise<any> => {
                if (error) return res.sendStatus(403);
                const accessToken = await refreshToken(user);
                return res.status(200).json({ status: true, accessToken });
            });
        } catch (error) {
            next(error);
        }
    };
}

export default Token;
