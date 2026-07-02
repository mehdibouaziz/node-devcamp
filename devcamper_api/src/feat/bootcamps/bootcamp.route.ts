import express from "express";
import {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius, uploadPhoto, updateAvg
} from './bootcamp.controller.ts';
import coursesRouter from "../courses/course.route.ts";
import reviewsRouter from "../reviews/review.route.ts";
import {authorizeRole, protect} from "../../middleware/auth.ts";

const router = express.Router();

// reroute to related resources
router.use('/:bootcampId/courses', coursesRouter);
router.use('/:bootcampId/reviews', reviewsRouter);

router
    .route('/')
    .get(getBootcamps)
    .post(protect, authorizeRole('publisher', 'admin'), createBootcamp);

router
    .route('/update-avg')
    .get(protect, authorizeRole('publisher', 'admin'), updateAvg)

router
    .route('/radius')
    .get(getBootcampsInRadius);

router
    .route('/:id/photo')
    .put(protect, authorizeRole('publisher', 'admin'), uploadPhoto)

router
    .route('/:id')
    .get(getBootcamp)
    .put(protect, authorizeRole('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorizeRole('publisher', 'admin'), deleteBootcamp);


export default router;