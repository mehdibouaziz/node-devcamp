import express from "express";
import {
    getCourses
} from "./course.controller.ts";

const router = express.Router({ mergeParams: true });

router
    .route("/")
    .get(getCourses);


export default router;