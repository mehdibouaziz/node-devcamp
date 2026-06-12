import Course from "./course.model.ts";
import courses from "./courses.json" with {type: 'json'};
import log from "../../utils/niceConsole.ts";

export const seedCourses = async () => {
    try {
        await Course.create(courses);
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
