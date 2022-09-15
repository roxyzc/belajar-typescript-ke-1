import { Request, Response, NextFunction } from 'express';
import Jwt from 'jsonwebtoken';
import Index from '.';
import { Logger } from '../library/Logging.library';

export interface IVerifyToken {
    verifyToken(): any;
    verifyTokenAndAuthorization(): any;
    verifyTokenAdmin(): any;
    checkExpired(): any;
}

class VerifyToken extends Index {
    public verifyToken() {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const authHeader = req.headers['authorization'];
                if (!authHeader) res.sendStatus(401);
                const token = authHeader?.split(' ')[1];
                Jwt.verify(token as string, process.env.ACCESSTOKEN_SECRET as string, async (err: any, decoded: any): Promise<any> => {
                    if (err) return res.sendStatus(403);
                    req.user = decoded;
                    next();
                });
            } catch (error) {
                Logger.error(error);
                next(error);
            }
        };
    }
    public verifyTokenAndAuthorization() {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                this.verifyToken()(req, res, () => {
                    if (req.user.role == 'admin' || req.user.id === req.params.id) return next();
                    return res.status(403).json({ success: false, message: 'You are not alowed to do that' });
                });
            } catch (error) {
                Logger.error(error);
                next(error);
            }
        };
    }
    public verifyTokenAdmin() {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                this.verifyToken()(req, res, () => {
                    if (req.user.role == 'admin') return next();
                    return res.status(403).json({ success: false, message: 'You are not alowed to do that' });
                });
            } catch (error) {
                Logger.error(error);
                next(error);
            }
        };
    }
    public checkExpired() {
        return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
            try {
                const authHeader = req.headers['authorization'];
                if (!authHeader) return res.sendStatus(401);
                const token = authHeader?.split(' ')[1];
                Jwt.verify(token as string, process.env.ACCESSTOKEN_SECRET as string, async (err: any, _decoded: any): Promise<any> => {
                    if (!err) return res.sendStatus(400);
                    req.token = token as string;
                    next();
                });
            } catch (error) {
                Logger.error(error);
                next(error);
            }
        };
    }
}

export default VerifyToken;
