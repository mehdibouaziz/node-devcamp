import type {Request, Response, NextFunction} from 'express';
import ReviewRepository from "./review.repository.ts";
import asyncHandler from "../../middleware/asyncHandler.ts";
import ErrorResponse from "../../utils/errorResponse.ts";
import BootcampR from "../bootcamps/bootcamp.repository.ts";
import type {HydratedDocument} from "mongoose";
import type {IUser} from "../users/user.model.ts";


/**
 * @desc Get all reviews
 * @route GET /api/v1/reviews
 * @route GET /api/v1/bootcamps/:bootcampId/reviews
 * @access Public
 */
export const getReviews = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await BootcampR.fetchBootcamp(req.params.bootcampId);

    if (req.params.bootcampId && !bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found`, 404));
    }
    const bootcampId = bootcamp?._id;

    if (bootcampId) {
        const reviews = await ReviewRepository.getReviewsByBootcamp(bootcampId);
        res
            .status(200)
            .json({
                success: true,
                count: reviews.length,
                data: reviews,
            });
    } else {
        const results = await ReviewRepository.getReviews(req.query);
        res
            .status(200)
            .json({
                success: true,
                ...results
            });
    }

})

/**
 * @desc Get a review
 * @route GET /api/v1/reviews/:id
 * @access Public
 */
export const getReview = async (req: Request, res: Response, next: NextFunction) => {
    const review = await ReviewRepository.getReview(req.params.id);

    if (!review) {
        return next(new ErrorResponse(`Review not found`, 404));
    }

    res
        .status(200)
        .json({
            success: true,
            data: review,
        });
}

/**
 * @desc Create new review
 * @route POST /api/v1/bootcamps/:bootcampId/reviews
 * @access Private
 */
export const createReview = async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user as HydratedDocument<IUser> | null | undefined;
    if (!user) {
        return;
    }

    const bootcamp = await BootcampR.fetchBootcamp(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found`, 404));
    }

    try {
        const result = await ReviewRepository.createReview(
            req.body,
            bootcamp._id,
            user._id);

        res.status(201).json({
            success: true,
            data: result,
        })

    } catch (err) {
        return next(err);
    }
}

/**
 * @desc Update review
 * @route PUT /api/v1/reviews/:id
 * @access Private
 */
export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
    const review = await ReviewRepository.getReview(req.params.id);

    if (!review) {
        return next(new ErrorResponse(`Review not found`, 404));
    }
    // check ownership
    if (res.locals.user
        && res.locals.user !== 'admin'
        && res.locals.user._id.toString() !== review.user.toString()
    ) {
        return next(new ErrorResponse(`User is not authorized to update this review`, 401));
    }

    const updatedReview = await ReviewRepository.updateReview(review._id, req.body);

    res
        .status(200)
        .json({
            success: true,
            data: updatedReview
        });
}

/**
 * @desc Delete review
 * @route DELETE /api/v1/reviews/:id
 * @access Private
 */
export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    const review = await ReviewRepository.getReview(req.params.id);

    if (!review) {
        return next(new ErrorResponse(`Review not found`, 404));
    }
    // check ownership
    if (res.locals.user
        && res.locals.user !== 'admin'
        && res.locals.user._id.toString() !== review.user.toString()
    ) {
        return next(new ErrorResponse(`User is not authorized to delete this review`, 401));
    }

    await ReviewRepository.deleteReview(review._id);

    res
        .status(200)
        .json({
            success: true,
            data: {}
        });
}
