import type {NextFunction, Request, Response} from "express";
import jwt, {type JwtPayload} from 'jsonwebtoken';
import asyncHandler from "./asyncHandler.ts";
import ErrorResponse from "../utils/errorResponse.ts";
import {getEnv} from "../utils/getEnv.ts";
import User from "../feat/users/user.model.ts";


// protect routes
export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }
    // else if (req.cookies.token) {
    //     token = req.cookies.token;
    // }

    if (!token) {
        return next(new ErrorResponse(`Not authorized`, 401));
    }

    try {
        // verify token
        const decoded = jwt.verify(token, getEnv('JWT_SECRET')) as JwtPayload;
        res.locals.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return next(new ErrorResponse(`Not authorized`, 401));
    }
});

// grant access to specific roles
export const authorizeRole = (...roles: string []) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(!res.locals.user){
            return next(new ErrorResponse(`Not authorized`, 401));
        }

        if(!roles.includes(res.locals.user.role)) {
            return next(new ErrorResponse(`Unauthorized access for users of role: ${res.locals.user.role}`, 403));
        }
        
        next();
    }
}