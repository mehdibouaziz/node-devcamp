import type {Request, Response, NextFunction} from 'express';
import Bootcamp from "./bootcamp.model.ts";
import ErrorResponse from "../../utils/errorResponse.ts";
import asyncHandler from "../../middleware/asyncHandler.ts";
import complexQuery, {getPagination} from "../../utils/complexQuery.ts";
import { pick } from "lodash"

/**
 * @desc Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
export const getBootcamps = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const pagination = await getPagination(req.query, Bootcamp);
    const bootcamps = await complexQuery(req.query, Bootcamp, pagination);

    res
        .status(200)
        .json({
            success: true,
            count: bootcamps.length,
            data: bootcamps,
            pagination: pick(pagination, ['next', 'prev'])
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

/**
 * @desc Get bootcamps within radius
 * @route GET /api/v1/bootcamps/radius?lon=:longitude&lat=:latitude&dist=:distance&unit=:unit
 * @access Private
 */
export const getBootcampsInRadius = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const longitude: number = req.query.lon ? +req.query.lon : 0;
    const latitude: number = req.query.lat ? +req.query.lat : 0;
    const distance: number = req.query.dist ? +req.query.dist : 0;
    const unit: string = req.query.unit === 'mi' ? 'mi' : 'km';

    console.log(req.query);
    console.log(longitude);

    const missing = ['lon', 'lat', 'dist']
        .filter(param => !req.query[param]);

    if (missing.length) {
        return next(
            new ErrorResponse(`Missing query param: ${missing.join(', ')}`, 400)
        );
    }

    // Calc radius
    const earthRadius: number = unit === 'mi' ? 3963 : 6378;
    const radius: number = distance / earthRadius;

    const bootcamps = await Bootcamp.find({
        location: {$geoWithin: {$centerSphere: [[longitude, latitude], radius]}}
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})