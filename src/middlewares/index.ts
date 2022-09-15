import { Request, Response, NextFunction } from 'express';
import { Logger } from '../library/Logging.library';
import { findUser } from '../services/User.service';

class Index {
    public checkValid() {
        return async (req: Request, _res: Response, next: NextFunction) => {
            try {
                const token: string = req.params.token as string;
                const user: any = await findUser(token);
                if (user.data.valid === 'active') throw new Error('user already active');
                next();
            } catch (error) {
                Logger.error(error);
                next(error);
            }
        };
    }
}

export default Index;

// export const checkValid = async (req: Request, _res: Response, next: NextFunction) => {
//     try {
//         const token: string = req.params.token as string;
//         const user: any = await findUser(token);
//         if (user.data.valid === 'active') throw new Error('your account has been validation');
//         next();
//     } catch (error) {
//         Logger.error(error);
//         next(error);
//     }
// };
