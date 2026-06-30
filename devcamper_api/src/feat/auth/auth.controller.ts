import type {Request, Response, NextFunction} from 'express';
import ErrorResponse from "../../utils/errorResponse.ts";
import asyncHandler from "../../middleware/asyncHandler.ts";
import UserRepository from "../users/user.repository.ts";
import {sendTokenResponse} from "./utils.ts";
import * as crypto from "node:crypto";
import userRepository from "../users/user.repository.ts";


/**
 * @desc Register user
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {name, email, password, role} = req.body;

    if(!password || password.length < 6) {
        return next(new ErrorResponse(`Invalid password: min length 6 chars`, 400));
    }

    const user = await UserRepository.createUser({
        name,
        email,
        password,
        role
    });
    if (!user) {
        return next(new ErrorResponse(`Error with user creation`, 500));
    }

    sendTokenResponse(user, 200, res)
});

/**
 * @desc Log in user
 * @route POST /api/v1/auth/login
 * @access Public
 */
export const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return next(new ErrorResponse(`Please provide an email and password`, 400));
    }

    const user = await UserRepository.getUserByEmail(email, true);
    if (!user) {
        return next(new ErrorResponse(`Invalid credentials`, 401));
    }

    const passwordValid = await user.verifyPassword(password);
    if (!passwordValid) {
        return next(new ErrorResponse(`Invalid credentials`, 401));
    }

    sendTokenResponse(user, 200, res);
});

/**
 * @desc Get current logged-in user
 * @route GET /api/v1/auth/me
 * @access Private
 */
export const getMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if (!user) {
        return next(new ErrorResponse(`Invalid credentials`, 401));
    }

    res
        .status(200)
        .json({
            success: true,
            data: user
        });
});

/**
 * @desc Forgot password
 * @route POST /api/v1/auth/forgotpassword
 * @access Public
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserRepository.getUserByEmail(req.body.email);

    if (!user) {
        return next(new ErrorResponse(`Invalid credentials`, 401));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    res
        .status(200)
        .json({
            success: true,
            data: {
                resetUrl,
                resetToken
            }
        });
});

/**
 * @desc Reset password
 * @route PUT /api/v1/auth/resetpassword/:resetToken
 * @access Public
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.password || req.body.password.length < 6) {
        return next(new ErrorResponse(`Invalid password: min length 6 chars`, 400));
    }

    const token = req.params.resetToken as string;
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await UserRepository.getOneUserByFields({
        resetPasswordToken,
    })

    if (!user) {
        return next(new ErrorResponse(`Invalid token`, 400));
    }
    if(!user.resetPasswordExpire || user.resetPasswordExpire.valueOf() < Date.now()) {
        return next(new ErrorResponse(`Expired token`, 400));
    }

    const updatedUser = await userRepository.resetPassword(user._id, req.body.password);

    if (!updatedUser) {
        return next(new ErrorResponse(`Password update error`, 500));
    }

    sendTokenResponse(updatedUser, 200, res);
});