import type {Request, Response, NextFunction} from 'express';
import ErrorResponse from "../../utils/errorResponse.ts";
import asyncHandler from "../../middleware/asyncHandler.ts";
import UserRepository from "../users/user.repository.ts";
import {sendTokenResponse} from "./utils.ts";


/**
 * @desc Register user
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {name, email, password, role} = req.body;

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
 * @route POST /api/v1/auth/me
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
