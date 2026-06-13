import express from "express";
import {
    createCourse, deleteCourse,
    getCourse,
    getCourses,
    updateCourse
} from "./course.controller.ts";

const router = express.Router({mergeParams: true});

router
    .route("/")
    .get(getCourses)
    .post(createCourse);

router
    .route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse);


export default router;