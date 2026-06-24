import type {Request, Response, NextFunction} from 'express';
import CourseR from "./course.repository.ts";
import BootcampR from "../bootcamps/bootcamp.repository.ts";
import asyncHandler from "../../middleware/asyncHandler.ts";
import ErrorResponse from "../../utils/errorResponse.ts";

/**
 * @desc Get all courses
 * @route GET /api/v1/courses
 * @route GET /api/v1/bootcamps/:bootcampId/courses
 * @access Public
 */
export const getCourses = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await BootcampR.fetchBootcamp(req.params.bootcampId);

    if (req.params.bootcampId && !bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found`, 404));
    }
    const bootcampId = bootcamp?._id;

    if(bootcampId) {
        const courses = await CourseR.fetchCoursesById(bootcampId);
        res
            .status(200)
            .json({
                success: true,
                count: courses.length,
                data: courses,
            });
    } else {
        const results = await CourseR.fetchCourses(req.query);
        res
            .status(200)
            .json({
                success: true,
                ...results
            });
    }
});

/**
 * @desc Get one course by id
 * @route GET /api/v1/courses/:id
 * @access Public
 */
export const getCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const course = await CourseR.fetchCourse(req.params.id);

    if (!course) {
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
    const bootcamp = await BootcampR.fetchBootcamp(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found`, 404));
    }

    const course = await CourseR.createCourse(req.body, bootcamp._id);

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
    const course = await CourseR.updateCourse(req.body, req.params.id);

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
    const course = await CourseR.fetchCourse(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`Course not found`, 404));
    }

    await CourseR.deleteCourse(course._id);

    res
        .status(200)
        .json({
            success: true,
            data: {}
        });
})