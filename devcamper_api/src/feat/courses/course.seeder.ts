import Course from "./course.model.ts";
import courses from "./courses.json" with {type: 'json'};
import log from "../../utils/niceConsole.ts";
import CourseRepository from "./course.repository.ts";
import BootcampRepository from "../bootcamps/bootcamp.repository.ts";
import UserRepository from "../users/user.repository.ts";

export const seedCourses = async () => {
    try {
        log.info('Importing courses...');
        for (const course of courses) {
            const {bootcamp: bootcampId, user: userId, ...data} = course;
            const bootcamp = await BootcampRepository.fetchBootcamp(bootcampId);
            const user = await UserRepository.getUser(userId);

            if(bootcamp && user) {
                await CourseRepository.createCourse({
                    ...data,
                    user: user._id,
                }, bootcamp._id);
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
