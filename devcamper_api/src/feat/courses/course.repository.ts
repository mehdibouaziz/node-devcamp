import Course, {type ICourse} from "./course.model.ts";
import {Types} from "mongoose";

const fetchCourses = async (bootcampId?: Types.ObjectId) => {
    if (bootcampId) {
        return Course.find({ bootcamp: bootcampId });
    } else {
        return Course.find().populate({
            path: 'bootcamp',
            select: 'name description',
        });
    }
}

const fetchCourse = async (id?: string|string[]) => {
    return Course.findById(id).populate({
        path: 'bootcamp',
        select: 'name description'
    });
}

const createCourse = async (body: ICourse, bootcampId: Types.ObjectId) => {
    const data = {
        ...body,
        bootcamp: bootcampId,
    };
    const course = new Course(data);
    await course.save();
    await Course.getAverageCost(course.bootcamp);
    return course;
}

const updateCourse = async (data: ICourse, id?: string|string[]) => {
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
    fetchCourse,
    createCourse,
    updateCourse,
    deleteCourse
}