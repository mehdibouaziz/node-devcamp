import express from "express";
import {protect} from "../../middleware/auth.ts";
import {createReview, deleteReview, getReview, getReviews, updateReview} from "./review.controller.ts";


const router = express.Router({mergeParams: true});

router
    .route('/')
    .get(getReviews)
    .post(protect, createReview);

router
    .route('/:id')
    .get(getReview)
    .put(protect, updateReview)
    .delete(protect, deleteReview);

export default router;