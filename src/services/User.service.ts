import User from '../models/User.model';
import { slug } from '../library/Slug.library';

export const createUser = async ({ username, email, password }: { username: string; email: string; password: string }) => {
    try {
        const user = await User.findOne({ $or: [{ 'data.username': slug(username) }, { 'data.email': email }] });
        return user
            ? Promise.reject({ message: 'Username or Email is already in use by another user', name: 'Duplicate' })
            : await User.create({ data: { username: slug(username), email, password } });
    } catch (error: any) {
        throw new Error(error);
    }
};

export const validateUser = async (token: string): Promise<any> => {
    try {
        return await User.findOneAndUpdate(
            { token },
            {
                $set: { 'data.valid': 'active' },
                $unset: { expiredAt: 1, token: 1 }
            },
            { new: true }
        );
    } catch (error: any) {
        throw new Error(error);
    }
};

export const findUser = async (input: string) => {
    const user = await User.findOne({ $or: [{ 'data.username': slug(input) }, { 'data.email': input }, { token: input }] });
    if (!user) throw new Error('user not found');
    return user;
};

export const deleteUser = async (id: string): Promise<Boolean> => {
    try {
        const success: Boolean | null = await User.findByIdAndDelete(id);
        return !success ? false : true;
    } catch (error: any) {
        throw new Error(error);
    }
};
