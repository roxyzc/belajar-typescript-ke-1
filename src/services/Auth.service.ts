import { findUser } from './User.service';
import { generateAccessToken } from '../utils/accessToken.util';

interface ILogin {
    username: string;
    password: string;
}

export const loginService = async (input: ILogin) => {
    const { username, password } = input;
    const user: any = await findUser(username);
    if (user.data.valid !== 'active') throw new Error('your account has not been activated');
    const valid = await user.comparePassword(password);
    if (!valid) return false;
    const { accessToken, refreshToken } = await generateAccessToken(user);
    user.token = refreshToken;
    user.save();
    return accessToken;
};
