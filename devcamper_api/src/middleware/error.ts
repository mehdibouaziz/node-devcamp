import type {Request, Response, NextFunction} from 'express';
import chalk from "chalk";
import ErrorResponse from "../utils/errorResponse.ts";
import {MongoError} from "mongodb";
import {Error} from "mongoose";


const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    // log to console for dev
    console.log(chalk.red(err.stack));
    console.log(err);

    const error = new ErrorResponse(err.message, 500, err.stack);

    // mongoose bad objectId
    if(err.name === "CastError") {
        error.setStatus(404);
        error.setMessage("Resource Not Found");
    }

    // mongoose duplicate key
    if(err instanceof MongoError && err.code === 11000) {
        error.setStatus(400);
        error.setMessage("Duplicate field value entered");
    }

    const errJson = {
        success: false,
        error: error.message,
        ...(process.env.NODE_ENV === "development" ? {stack: error.stack?.split('\n')} : {})
    };

    res
        .status(error.statusCode)
        .json(errJson);
}

export default errorHandler;
