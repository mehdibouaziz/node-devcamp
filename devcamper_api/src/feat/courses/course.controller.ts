import type {Request, Response, NextFunction} from 'express';
import Course from "./course.model.ts";
import asyncHandler from "../../middleware/asyncHandler.ts";
import ErrorResponse from "../../utils/errorResponse.ts";
import Bootcamp from "../bootcamps/bootcamp.model.ts";

/**
 * @desc Get all courses
 * @route GET /api/v1/courses
 * @route GET /api/v1/bootcamps/:bootcampId/courses
 * @access Public
 */
export const getCourses = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description',
        });
    }

    const courses = await query;

    res
        .status(200)
        .json({
            success: true,
            count: courses.length,
            data: courses,
        });
});

/**
 * @desc Get one course by id
 * @route GET /api/v1/courses/:id
 * @access Public
 */
export const getCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if(!course) {
        return next(new ErrorResponse(`Course not found`, 404));
    }

    res
        .status(200)
        .json({
            success: true,
            data: course,
        });
});

/**
 * @desc Create new course
 * @route POST /api/v1/bootcamps/:bootcampId/courses
 * @access Private
 */
export const createCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const data = {
        ...req.body,
        bootcamp: req.params.bootcampId,
        // todo add user
    }

    const bootcamp = Bootcamp.findById(data.bootcamp);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found`, 404));
    }

    const course = new Course(data);
    await course.save();

    res.status(201).json({
        success: true,
        data: course,
    })
})

/**
 * @desc Update course
 * @route PUT /api/v1/courses/:id
 * @access Private
 */
export const updateCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!course) {
        return next(new ErrorResponse(`Course not found`, 404));
    }

    res
        .status(200)
        .json({
            success: true,
            data: course
        });
})

/**
 * @desc Delete course
 * @route DELETE /api/v1/courses/:id
 * @access Private
 */
export const deleteCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`Course not found`, 404));
    }

    await course.deleteOne();

    res
        .status(200)
        .json({
            success: true,
            data: {}
        });
})