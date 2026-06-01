import type {Request, Response, NextFunction} from 'express';
import Bootcamp from "./bootcamp.model.ts";
import log from "../../utils/niceConsole.ts";
import ErrorResponse from "../../utils/errorResponse.ts";

/**
 * @desc Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
export const getBootcamps = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bootcamps = await Bootcamp.find();

        res
            .status(200)
            .json({
                success: true,
                count: bootcamps.length,
                data: bootcamps
            });
    } catch (err) {
        next(err);
    }
}

/**
 * @desc Get bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
export const getBootcamp = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
    } catch (err) {
        next(err);
    }
}

/**
 * @desc Create new bootcamp
 * @route POST /api/v1/bootcamps
 * @access Private
 */
export const createBootcamp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bootcamp = new Bootcamp(req.body);
        await bootcamp.save();

        res.status(201).json({
            success: true,
            data: bootcamp,
        })
    } catch (err) {
        next(err);
    }
}

/**
 * @desc Update bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access Private
 */
export const updateBootcamp = async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!bootcamp) {
        return res.status(404).json({success: false, msg: "Bootcamp not found"});
    }

    res
        .status(200)
        .json({
            success: true,
            data: bootcamp
        });
}

/**
 * @desc Delete bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access Private
 */
export const deleteBootcamp = async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
        return res.status(404).json({success: false, msg: "Bootcamp not found"});
    }

    res
        .status(200)
        .json({
            success: true,
            data: {}
        });
}