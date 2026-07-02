import Review, {type IReviewDocument} from "./review.model.ts";
import {Types} from "mongoose";
import complexQuery from "../../utils/complexQuery.ts";
import type {ParsedQs} from "qs";
import type {NextFunction} from "express";
import ErrorResponse from "../../utils/errorResponse.ts";


const getReviews = async (reqQuery: ParsedQs) => {
    return await complexQuery(reqQuery, Review, {
        path: 'bootcamp',
        select: 'name description',
    });
}

const getReviewsByBootcamp = async (bootcampId: Types.ObjectId) => {
    return Review.find({
        bootcamp: bootcampId
    });
}

const getReview = async (id?: string | string[]) => {
    return Review.findById(id).populate({
        path: 'bootcamp',
        select: 'name description'
    });
}

const createReview = async (
    body: Partial<IReviewDocument>,
    bootcampId: Types.ObjectId,
    userId: Types.ObjectId,
) => {
    const existingReview = await Review.findOne({
        bootcamp: bootcampId,
        user: userId,
    });
    if (existingReview) {throw new ErrorResponse(`User already created a review for this bootcamp`, 400);}

    const data = {
        ...body,
        bootcamp: bootcampId,
        user: userId,
    };

    const review = new Review(data);
    await review.save();
    // todo recalculate average score
    return review;
}

const updateReview = async (id: Types.ObjectId, data: Partial<IReviewDocument>) => {
    return Review.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });
}

const deleteReview = async (id: Types.ObjectId) => {
    const review = await Review.findById(id);
    if (review) {
        const bootcampId = review.bootcamp;
        await review.deleteOne();
        // todo recalculate average score
    }
}

export default {
    getReviews,
    getReviewsByBootcamp,
    getReview,
    createReview,
    updateReview,
    deleteReview,
}