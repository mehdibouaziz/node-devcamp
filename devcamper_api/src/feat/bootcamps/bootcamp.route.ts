import express from "express";
import {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius
} from './bootcamp.controller.ts';
import courseRouter from "../courses/course.route.ts"

const router = express.Router();

// reroute to related resources
router.use('/:bootcampId/courses', courseRouter);

router
    .route('/')
    .get(getBootcamps)
    .post(createBootcamp);

router
    .route('/radius')
    .get(getBootcampsInRadius);

router
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);



export default router;