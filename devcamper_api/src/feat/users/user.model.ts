import {type Model, model, Schema} from 'mongoose';
import jwt from 'jsonwebtoken';
import {getEnv} from "../../utils/getEnv.ts";
import type {StringValue} from "ms";
import bcrypt from "bcryptjs";

// add properties here
export interface IUserDocument {
    name: string,
    email: string,
    role?: string,
    password: string,
    resetPasswordToken?: string,
    resetPasswordExpire?: Date,
    createdAt?: string
}

// add methods here
export interface IUser extends IUserDocument {
    getSignedJwtToken(): string;
    verifyPassword(passwordToCheck: string): Promise<boolean>;
}

// add statics here
export interface IUserModel extends Model<IUser> {}

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        unique: true,
        match: [
            /^\S+@\S+\.\S+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Password required'],
        minLength: [6, 'Passwords need at least 6 characters'],
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
});

// METHODS
UserSchema.method('getSignedJwtToken', function getSignedJwtToken() {
    return jwt.sign(
        {id: this._id},
        getEnv('JWT_SECRET'),
        {expiresIn: getEnv('JWT_EXPIRE') as StringValue})
});

UserSchema.method('verifyPassword', async function verifyPassword(passwordToCheck: string) {
    // in case the password was not forced select
    if(!this.password){
        const hash = (await User.findById(this._id).select('+password'))?.password;
        if(!hash){return false;}
        return await bcrypt.compare(passwordToCheck, hash);
    }
    return await bcrypt.compare(passwordToCheck, this.password);
});

// MODEL
const User: IUserModel = model<IUser, IUserModel>('User', UserSchema);

export default User;