import Course from "./course.model.ts";
import courses from "./courses.json" with {type: 'json'};
import log from "../../utils/niceConsole.ts";
import CourseRepository from "./course.repository.ts";
import BootcampRepository from "../bootcamps/bootcamp.repository.ts";
import _ from "lodash";

export const seedCourses = async () => {
    try {
        log.info('Importing courses...');
        for (const course of courses) {
            const bootcamp = await BootcampRepository.fetchBootcamp(course.bootcamp);
            if (bootcamp) {
                await CourseRepository.createCourse(_.omit(course, 'bootcamp'), bootcamp._id);
            }
        }
        log.success('Courses imported')
    } catch (err) {
        console.error(err);
    }
}

export const deleteCourses = async () => {
    try {
        await Course.deleteMany();
        log.warning('Courses deleted')
    } catch (err) {
        console.error(err);
    }
}
