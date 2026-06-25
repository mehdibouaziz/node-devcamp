import type {Request, Response, NextFunction} from 'express';
import ErrorResponse from "../../utils/errorResponse.ts";
import asyncHandler from "../../middleware/asyncHandler.ts";
import UserRepository from "../users/user.repository.ts";


/**
 * @desc Register user
 * @route POST /api/v1/auth/register
 * @access Private
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

    const token = user.getSignedJwtToken()

    res.status(200).json({
        status: true,
        json: {
            success: true,
            token
        },
    });
});