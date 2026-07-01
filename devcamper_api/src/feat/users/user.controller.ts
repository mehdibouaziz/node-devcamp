import type {Request, Response, NextFunction} from 'express';

import ErrorResponse from "../../utils/errorResponse.ts";
import UserRepository from "./user.repository.ts";
import asyncHandler from "../../middleware/asyncHandler.ts";

/**
 * @desc Update user details: only name and email
 *
 * ACCESS: Can be used either by users to edit only their own details, or by admins to edit any user's details
 * @route PUT /api/v1/users/:id
 * @access Private
 */
export const updateUserDetails = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const loggedUser = res.locals.user;
    if (!loggedUser) {
        return next(new ErrorResponse(`Invalid credentials`, 401));
    }
    const userToUpdate = await UserRepository.getUser(req.params.id);
    if(!userToUpdate) {
        return next(new ErrorResponse(`User not found`, 404));
    }

    if(
        userToUpdate._id.toString() !== loggedUser._id.toString()
        && loggedUser.role !== 'admin'
    ) {
        return next(new ErrorResponse(`Not authorized`, 403));
    }

    const updatedUser = await UserRepository.updateUser(userToUpdate._id, req.body);

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


/**
 * @desc ADMIN ONLY Get all users
 * @route GET /api/v1/users
 * @access Private
 */
export const getUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const results = await UserRepository.getUsers(req.query);

    res
        .status(200)
        .json({
            success: true,
            ...results
        });
});

/**
 * @desc ADMIN ONLY Get a user
 * @route GET /api/v1/users/:id
 * @access Private
 */
export const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserRepository.getUser(req.params.id);

    if(!user) {
        return next(new ErrorResponse(`User not found`, 404));
    }

    res
        .status(200)
        .json({
            success: true,
            data: user
        });
});

/**
 * @desc ADMIN ONLY Create user
 * @route POST /api/v1/users
 * @access Private
 */
export const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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

    res
        .status(201)
        .json({
            success: true,
            data: user
        });
});

/**
 * @desc ADMIN ONLY Delete user
 * @route DELETE /api/v1/users/:id
 * @access Private
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserRepository.getUser(req.params.id);

    if(!user) {
        return next(new ErrorResponse(`User not found`, 404));
    }

    await UserRepository.deleteUser(user._id);

    res
        .status(200)
        .json({
            success: true,
            data: {}
        });
});