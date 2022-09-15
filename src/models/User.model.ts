import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export interface IUserModel {
    readonly role: string;
    data: {
        username: string;
        email: string;
        password: string;
        profile?: Buffer;
        valid: string;
    };
    token?: string;
    expiredAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<Boolean>;
}

export interface IUser extends IUserModel, Document {}

const UserSchema: Schema = new Schema(
    {
        role: {
            type: String,
            required: true,
            enum: ['admin', 'user', 'email'],
            default: function (this: IUser) {
                return this.data.username === process.env.USERNAME_ADMIN && this.data.password === process.env.PASSWORD_ADMIN ? 'admin' : 'user';
            }
        },
        data: {
            username: {
                type: String,
                required: true,
                unique: true,
                min: 6,
                max: 12
            },
            email: {
                type: String,
                required: true,
                unique: true
            },
            password: {
                type: String,
                required: function (this: IUser) {
                    return this.role === 'email' ? false : true;
                },
                min: 12,
                max: 24
            },
            profile: {
                type: Buffer,
                required: false,
                default: undefined
            },
            valid: {
                type: String,
                enum: ['pending', 'active'],
                required: true,
                default: 'pending'
            }
        },
        token: {
            type: String,
            required: false,
            default: function (this: IUser) {
                return this.data.valid === 'active' ? undefined : crypto.randomBytes(64).toString('hex');
            }
        },
        expiredAt: {
            type: Date,
            expires: 3600,
            default: function (this: IUser) {
                return this.data.valid === 'active' ? undefined : Date.now();
            }
        }
    },
    { timestamps: true }
);

UserSchema.pre('save', async function (this: IUser, next) {
    if (!this.isModified('data')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.data.password, salt);
    this.data.password = hash;
    return next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<Boolean> {
    const user = this as IUser;
    // console.log(user.password);
    return await bcrypt.compare(candidatePassword, user.data.password).catch(() => false);
};

export default model<IUser>('User', UserSchema);
