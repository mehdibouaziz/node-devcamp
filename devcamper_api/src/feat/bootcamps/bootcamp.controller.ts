import type {Request, Response, NextFunction} from 'express';
import BootcampR from "./bootcamp.repository.ts";
import ErrorResponse from "../../utils/errorResponse.ts";
import asyncHandler from "../../middleware/asyncHandler.ts";
import type {IUser} from "../users/user.model.ts";
import type {HydratedDocument} from "mongoose";
import Course from "../courses/course.model.ts";
import Review from "../reviews/review.model.ts";
import log from "../../utils/niceConsole.ts";

/**
 * @desc Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
export const getBootcamps = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const results = await BootcampR.fetchBootcamps(req.query);

    res
        .status(200)
        .json({
            success: true,
            ...results
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
    const user = res.locals.user as HydratedDocument<IUser>|null|undefined;
    if(!user) {return;}

    // find if user has already published bootcamps (only admins can publish >1)
    if(user.role !== 'admin') {
        const publishedBootcamp = await BootcampR.getBootcampByUser(user._id);
        if (publishedBootcamp) {
            return next(new ErrorResponse(`User has already published a bootcamp`, 400));
        }
    }

    const bootcamp = await BootcampR.createBootcamp({
        ...req.body,
        user: user._id,
    });

    res
        .status(201)
        .json({
            success: true,
            data: bootcamp,
        });
})

/**
 * @desc Update bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access Private
 */
export const updateBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await BootcampR.fetchBootcamp(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found`, 404));
    }

    // check ownership
    if(res.locals.user
        && res.locals.user !== 'admin'
        && res.locals.user._id.toString() !== bootcamp.user.toString()
    ) {
        return next(new ErrorResponse(`User is not authorized to update this bootcamp`, 401));
    }

    const updatedBootcamp = await BootcampR.updateBootcamp(req.body, req.params.id);

    res
        .status(200)
        .json({
            success: true,
            data: updatedBootcamp
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
    // check ownership
    if(res.locals.user
        && res.locals.user !== 'admin'
        && res.locals.user._id.toString() !== bootcamp.user.toString()
    ) {
        return next(new ErrorResponse(`User is not authorized to delete this bootcamp`, 401));
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

    res
        .status(200)
        .json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        });
})

/**
 * @desc Upload a photo for a bootcamp
 * @route PUT /api/v1/bootcamps/:id/photo
 * @access Private
 */
export const uploadPhoto = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await BootcampR.fetchBootcamp(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found`, 404));
    }
    if (!req.files) {
        return next(new ErrorResponse(`Missing image`, 400));
    }
    // check ownership
    if(res.locals.user
        && res.locals.user !== 'admin'
        && res.locals.user._id.toString() !== bootcamp.user.toString()
    ) {
        return next(new ErrorResponse(`User is not authorized to update this bootcamp`, 401));
    }

    const file = req.files.file;
    if (!file || Array.isArray(file) || !file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Issue with image file`, 400));
    }

    const maxFileSize = +(process.env.FILE_UPLOAD_MAX_SIZE || 0);
    if (file.size > maxFileSize) {
        return next(new ErrorResponse(`File size exceeded. Max allowed: ${maxFileSize / 1000000}mB`, 400));
    }

    await BootcampR.uploadPhoto(bootcamp._id, file, next);
    res
        .status(200)
        .json({
            success: true,
            data: file.name
        });
})

/**
 * @desc Update all the average ratings and costs
 * @route GET /api/v1/bootcamps/update-avg
 * @access Private
 */
export const updateAvg = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {data} = await BootcampR.fetchBootcamps({});
    log.info('Updating average ratings and costs...')

    for (const bootcamp of data) {
        await Course.getAverageCost(bootcamp._id);
        await Review.getAverageRating(bootcamp._id);
    }

    log.success('DONE: Updating average ratings and costs')

    res
        .status(200)
        .json({
            success: true,
        });
})