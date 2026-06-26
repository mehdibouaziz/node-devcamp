import type {Response} from 'express';
import type {HydratedDocument} from "mongoose";
import type {IUser} from "../users/user.model.ts";
import {getEnv} from "../../utils/getEnv.ts";

export const sendTokenResponse = (user: HydratedDocument<IUser>, statusCode: number, res: Response) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + (+getEnv('JWT_COOKIE_EXPIRE') * 24 * 60 * 60 * 1000)),
        httpOnly: true,
        ...(getEnv('NODE_ENV') === 'production' ? {secure: true} : {}),
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
}