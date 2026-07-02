import Bootcamp from "./bootcamp.model.ts";
import bootcamps from "./bootcamps.json" with {type: 'json'};
import log from "../../utils/niceConsole.ts";
import BootcampRepository from "./bootcamp.repository.ts";
import UserRepository from "../users/user.repository.ts";

export const seedBootcamps = async () => {
    try {
        log.info('Importing bootcamps...');
        for (const bootcamp of bootcamps) {
            const {user: userId, ...data} = bootcamp;
            const user = await UserRepository.getUser(userId);

            if(user) {
                await BootcampRepository.createBootcamp({
                    ...data,
                    user: user._id
                });
            }
        }
        log.success('Bootcamps imported')
    } catch (err) {
        console.error(err);
    }
}

export const deleteBootcamps = async () => {
    try {
        await Bootcamp.deleteMany();
        log.warning('Bootcamps deleted')
    } catch (err) {
        console.error(err);
    }
}
