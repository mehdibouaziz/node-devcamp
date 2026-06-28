import express from "express";
import {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius, uploadPhoto
} from './bootcamp.controller.ts';
import courseRouter from "../courses/course.route.ts";
import {authorizeRole, protect} from "../../middleware/auth.ts";

const router = express.Router();

// reroute to related resources
router.use('/:bootcampId/courses', courseRouter);

router
    .route('/')
    .get(getBootcamps)
    .post(protect, authorizeRole('publisher', 'admin'), createBootcamp);

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