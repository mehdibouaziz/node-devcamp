import type {Request, Response, NextFunction} from 'express';
import CourseR from "./course.repository.ts";
import BootcampR from "../bootcamps/bootcamp.repository.ts";
import asyncHandler from "../../middleware/asyncHandler.ts";
import ErrorResponse from "../../utils/errorResponse.ts";
import type {HydratedDocument} from "mongoose";
import type {IUser} from "../users/user.model.ts";

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
        const courses = await CourseR.fetchCoursesByBootcamp(bootcampId);
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
    const user = res.locals.user as HydratedDocument<IUser>|null|undefined;
    if(!user) {return;}

    const bootcamp = await BootcampR.fetchBootcamp(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found`, 404));
    }
    // check ownership
    if(res.locals.user
        && res.locals.user !== 'admin'
        && res.locals.user._id.toString() !== bootcamp.user.toString()
    ) {
        return next(new ErrorResponse(`User is not authorized to add a course to this bootcamp`, 401));
    }

    const course = await CourseR.createCourse({
        ...req.body,
        user: user._id,
    }, bootcamp._id);

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
    const course = await CourseR.fetchCourse(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`Course not found`, 404));
    }
    // check ownership
    if(res.locals.user
        && res.locals.user !== 'admin'
        && res.locals.user._id.toString() !== course.user.toString()
    ) {
        return next(new ErrorResponse(`User is not authorized to update this course`, 401));
    }

    const updatedCourse = await CourseR.updateCourse(req.body, req.params.id);

    res
        .status(200)
        .json({
            success: true,
            data: updatedCourse
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
    // check ownership
    if(res.locals.user
        && res.locals.user !== 'admin'
        && res.locals.user._id.toString() !== course.user.toString()
    ) {
        return next(new ErrorResponse(`User is not authorized to delete this course`, 401));
    }

    await CourseR.deleteCourse(course._id);

    res
        .status(200)
        .json({
            success: true,
            data: {}
        });
})