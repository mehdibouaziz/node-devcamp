import type {Request, Response, NextFunction} from 'express';
import BootcampR from "./bootcamp.repository.ts";
import ErrorResponse from "../../utils/errorResponse.ts";
import asyncHandler from "../../middleware/asyncHandler.ts";

/**
 * @desc Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
export const getBootcamps = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {bootcamps, pagination} = await BootcampR.fetchBootcamps(req.query);

    res
        .status(200)
        .json({
            success: true,
            count: bootcamps.length,
            data: bootcamps,
            pagination
        });
})

/**
 * @desc Get bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
export const getBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await BootcampR.fetchBootcamp(req.params.id);

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
    const bootcamp = await BootcampR.createBootcamp(req.body);

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
    const bootcamp = await BootcampR.updateBootcamp(req.body, req.params.id);

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
    const bootcamp = await BootcampR.fetchBootcamp(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found`, 404));
    }

    await BootcampR.deleteBootcamp(`${req.params.id}`);

    res
        .status(200)
        .json({
            success: true,
            data: {}
        });
})

/**
 * @desc Get bootcamps within radius
 * @route GET /api/v1/bootcamps/radius?lon=:longitude&lat=:latitude&dist=:distance&unit=:unit
 * @access Private
 */
export const getBootcampsInRadius = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const missing = ['lon', 'lat', 'dist']
        .filter(param => !req.query[param]);

    if (missing.length) {
        return next(
            new ErrorResponse(`Missing query param: ${missing.join(', ')}`, 400)
        );
    }

    const bootcamps = await BootcampR.fetchBootcampsByRadius(req.query);

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})