import Bootcamp from "./bootcamp.model.ts";
import bootcamps from "./bootcamps.json" with {type: 'json'};
import log from "../../utils/niceConsole.ts";
import BootcampRepository from "./bootcamp.repository.ts";

export const seedBootcamps = async () => {
    try {
        log.info('Importing bootcamps...');
        await BootcampRepository.createBootcamps(bootcamps)
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
