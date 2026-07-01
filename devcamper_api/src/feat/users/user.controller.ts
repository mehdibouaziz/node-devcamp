import type {Request, Response, NextFunction} from 'express';

import ErrorResponse from "../../utils/errorResponse.ts";
import UserRepository from "./user.repository.ts";
import asyncHandler from "../../middleware/asyncHandler.ts";

/**
 * @desc Update logged-in user's details: only name and email
 * @route PUT /api/v1/users/:id
 * @access Private
 */
export const updateUserDetails = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if (!user) {
        return next(new ErrorResponse(`Invalid credentials`, 401));
    }

    const updatedUser = await UserRepository.updateUser(user._id, req.body);

    if (!updatedUser) {
        return next(new ErrorResponse(`User update error`, 500));
    }

    res
        .status(200)
        .json({
            success: true,
            data: updatedUser
        });
});