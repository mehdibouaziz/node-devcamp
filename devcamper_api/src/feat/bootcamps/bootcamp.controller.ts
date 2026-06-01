import type {Request, Response, NextFunction} from 'express';
import Bootcamp from "./bootcamp.model.ts";
import ErrorResponse from "../../utils/errorResponse.ts";
import asyncHandler from "../../middleware/asyncHandler.ts";

/**
 * @desc Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
export const getBootcamps = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamps = await Bootcamp.find();

    res
        .status(200)
        .json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        });
})

/**
 * @desc Get bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
export const getBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found`, 404));
    }

    res
        .status(200)
        .json({
            success: true,
            data: bootcamp
        });

})

/**
 * @desc Create new bootcamp
 * @route POST /api/v1/bootcamps
 * @access Private
 */
export const createBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const bootcamp = new Bootcamp(req.body);
        await bootcamp.save();

        res.status(201).json({
            success: true,
            data: bootcamp,
        })
})

/**
 * @desc Update bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access Private
 */
export const updateBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found`, 404));
    }

    res
        .status(200)
        .json({
            success: true,
            data: bootcamp
        });
})

/**
 * @desc Delete bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access Private
 */
export const deleteBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found`, 404));
    }

    res
        .status(200)
        .json({
            success: true,
            data: {}
        });
})