import Course, {type ICourse} from "./course.model.ts";
import {Types} from "mongoose";
import complexQuery from "../../utils/complexQuery.ts";
import type {ParsedQs} from "qs";


const fetchCourses = async (reqQuery: ParsedQs) => {
    return await complexQuery(reqQuery, Course, {
        path: 'bootcamp',
        select: 'name description',
    });
}

const fetchCoursesByBootcamp = async (bootcampId: Types.ObjectId) => {
    return Course.find({bootcamp: bootcampId});
}

const fetchCourse = async (id?: string | string[]) => {
    return Course.findById(id).populate({
        path: 'bootcamp',
        select: 'name description'
    });
}

const createCourse = async (body: Partial<ICourse>, bootcampId: Types.ObjectId) => {
    const data = {
        ...body,
        bootcamp: bootcampId,
    };
    const course = new Course(data);
    await course.save();
    await Course.getAverageCost(course.bootcamp);
    return course;
}

const createCourses = async (courses: ICourse[]) => {
    for (const course of courses) {
        await createCourse(course, course.bootcamp);
    }
}

const updateCourse = async (data: ICourse, id?: string | string[]) => {
    return Course.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });
}

const deleteCourse = async (id: Types.ObjectId) => {
    const course = await Course.findById(id);
    if (!course) {
        return;
    }
    const bootcampId = course.bootcamp;
    await course.deleteOne();
    await Course.getAverageCost(bootcampId);
}

export default {
    fetchCourses,
    fetchCoursesByBootcamp,
    fetchCourse,
    createCourse,
    createCourses,
    updateCourse,
    deleteCourse
}