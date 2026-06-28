import express from "express";
import {
    createCourse, deleteCourse,
    getCourse,
    getCourses,
    updateCourse
} from "./course.controller.ts";
import {authorizeRole, protect} from "../../middleware/auth.ts";

const router = express.Router({mergeParams: true});

router
    .route("/")
    .get(getCourses)
    .post(protect, authorizeRole('publisher', 'admin'), createCourse);

router
    .route('/:id')
    .get(getCourse)
    .put(protect, authorizeRole('publisher', 'admin'), updateCourse)
    .delete(protect, authorizeRole('publisher', 'admin'), deleteCourse);


export default router;