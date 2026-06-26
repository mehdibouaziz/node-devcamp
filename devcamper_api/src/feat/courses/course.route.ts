import express from "express";
import {
    createCourse, deleteCourse,
    getCourse,
    getCourses,
    updateCourse
} from "./course.controller.ts";
import {protect} from "../../middleware/auth.ts";

const router = express.Router({mergeParams: true});

router
    .route("/")
    .get(getCourses)
    .post(protect, createCourse);

router
    .route('/:id')
    .get(getCourse)
    .put(protect, updateCourse)
    .delete(protect, deleteCourse);


export default router;