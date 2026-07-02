import Review from "./review.model.ts";
import reviews from "./reviews.json" with {type: 'json'};
import log from "../../utils/niceConsole.ts";
import ReviewRepository from "./review.repository.ts";
import BootcampRepository from "../bootcamps/bootcamp.repository.ts";
import UserRepository from "../users/user.repository.ts";

export const seedReviews = async () => {
    try {
        log.info('Importing reviews...');
        for (const review of reviews) {
            const {bootcamp: bootcampId, user: userId, rating, ...data} = review;
            const bootcamp = await BootcampRepository.fetchBootcamp(bootcampId);
            const user = await UserRepository.getUser(userId);

            if(bootcamp && user) {
                await ReviewRepository.createReview({
                    ...data,
                    rating: +rating,
                }, bootcamp._id, user._id)
            }
        }
        log.success('Reviews imported')
    } catch (err) {
        console.error(err);
    }
}

export const deleteReviews = async () => {
    try {
        await Review.deleteMany();
        log.warning('Reviews deleted')
    } catch (err) {
        console.error(err);
    }
}
