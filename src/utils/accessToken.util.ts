import Jwt from 'jsonwebtoken';

export const generateAccessToken = ({ id, role }: { id: string; role: string }) => {
    const accessToken = Jwt.sign({ id, role }, process.env.ACCESSTOKEN_SECRET as string, { expiresIn: '1s' });
    const refreshToken = Jwt.sign({ id, role }, process.env.REFRESHTOKEN_SECRET as string, { expiresIn: '1d' });
    return Promise.resolve({ accessToken, refreshToken });
};

export const refreshToken = ({ id, role }: { id: string; role: string }) => {
    const accessToken = Jwt.sign({ id, role }, process.env.ACCESSTOKEN_SECRET as string, { expiresIn: '3s' });
    return Promise.resolve({ accessToken, refreshToken });
};
