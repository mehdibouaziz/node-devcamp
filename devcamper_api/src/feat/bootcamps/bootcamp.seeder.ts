import Bootcamp from "./bootcamp.model.ts";
import bootcamps from "./bootcamps.json" with {type: 'json'};
import log from "../../utils/niceConsole.ts";

export const seedBootcamps = async () => {
    try {
        await Bootcamp.insertMany(bootcamps);
        log.success('Bootcamps imported')
    } catch (err) {
        console.error(err);
    }
}

export const wipeBootcamps = async () => {
    try {
        await Bootcamp.deleteMany();
        log.warning('Bootcamps deleted')
    } catch (err) {
        console.error(err);
    }
}
