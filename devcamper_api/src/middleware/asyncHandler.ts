import type {NextFunction, Request, Response} from "express";

type asyncHandlerI = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => (req: Request, res: Response, next: NextFunction) => Promise<void>;

const asyncHandler: asyncHandlerI = fn => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);


export default asyncHandler;