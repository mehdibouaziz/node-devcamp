import type {Request, Response, NextFunction} from 'express';

/**
 * @desc Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
export const getBootcamps = (req: Request, res: Response, next: NextFunction) => {
    res
        .status(200)
        .json({
            success: true,
            msg: 'Show all bootcamps',
        });
}

/**
 * @desc Get bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
export const getBootcamp = (req: Request, res: Response, next: NextFunction) => {
    res
        .status(200)
        .json({
            success: true,
            msg: `Show bootcamp ${req.params.id}`
        });
}

/**
 * @desc Create new bootcamp
 * @route POST /api/v1/bootcamps
 * @access Private
 */
export const createBootcamp = (req: Request, res: Response, next: NextFunction) => {
    res
        .status(201)
        .json({
            success: true,
            msg: 'Add new bootcamp'
        });
}

/**
 * @desc Update bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access Private
 */
export const updateBootcamp = (req: Request, res: Response, next: NextFunction) => {
    res
        .status(200)
        .json({
            success: true,
            msg: `update bootcamp ${req.params.id}`
        });
}

/**
 * @desc Delete bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access Private
 */
export const deleteBootcamp = (req: Request, res: Response, next: NextFunction) => {
    res
        .status(200)
        .json({
            success: true,
            msg: `delete bootcamp ${req.params.id}`
        });
}