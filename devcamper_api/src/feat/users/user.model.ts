import {model, Schema} from 'mongoose';

export interface IUser {
    name: string,
    email: string,
    role?: string,
    password: string,
    resetPasswordToken?: string,
    resetPasswordExpire?: Date,
    createdAt?: string
}

const UserSchema = new Schema<IUser>({
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

const User = model<IUser>('User', UserSchema);

export default User;