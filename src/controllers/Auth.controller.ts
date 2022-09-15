import { Response, Request, NextFunction } from 'express';
import ValidateSchema from '../middlewares/validateSchema.middleware';
import { loginService } from '../services/Auth.service';
import { Logger } from '../library/Logging.library';

class Auth extends ValidateSchema {
    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const user: Boolean | string = await loginService(req.body);
            !user ? next({ name: 'Login Failed', message: "Password doesn't match" }) : res.status(200).json({ status: true, message: 'Login succesfully', token: user });
        } catch (error) {
            Logger.error(error);
            next(error);
        }
    }
}

export default Auth;
