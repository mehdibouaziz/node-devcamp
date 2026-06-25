import User from "./user.model.ts";
import users from "./users.json" with {type: 'json'};
import log from "../../utils/niceConsole.ts";
import UserRepository from "./user.repository.ts";

export const seedUsers = async () => {
    try {
        log.info('Importing users...');
        await UserRepository.createUsers(users);
        log.success('Users imported')
    } catch (err) {
        console.error(err);
    }
}

export const deleteUsers = async () => {
    try {
        await User.deleteMany();
        log.warning('Users deleted')
    } catch (err) {
        console.error(err);
    }
}
