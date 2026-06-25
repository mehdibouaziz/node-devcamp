import 'dotenv/config';
import dns from "node:dns";
import {stdin as input, stdout as output} from "node:process";
import {createInterface} from "node:readline/promises";
import connectDB from "./db.ts";
import log from "../src/utils/niceConsole.ts";
//seeders
import {seedBootcamps, deleteBootcamps} from "../src/feat/bootcamps/bootcamp.seeder.ts";
import {deleteCourses, seedCourses} from "../src/feat/courses/course.seeder.ts";
import {deleteUsers, seedUsers} from "../src/feat/users/user.seeder.ts";


if (process.env.NODE_ENV !== "production") {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

// connect to DB
const uri = process.env.MONGODB_URI ?? '';
await connectDB(uri);


// import into DB
const importData = async () => {
    await seedBootcamps();
    await seedCourses();
    await seedUsers();
}

// DELETE database
const deleteData = async () => {
    await deleteBootcamps();
    await deleteCourses();
    await deleteUsers();
}


// PROMPTS
const rl = createInterface({input, output});

const confirm = async (prompt: string) => {
    const response = await rl.question(`?  ${prompt} (y/N): `);

    return ["y", "yes"].includes(response.trim().toLowerCase())
}
const askParam = async () => {
    return await rl.question(`?  Pick seeder mode: (s=seed, W=wipe, C=clean): `);
}

const exit = () => {
    log.info("Closing...");
    process.exit();
}

const abort = () => {
    log.warning("Abort...");
    process.exit();
}

// Command handler
let mode = null;
if (process.env.npm_config_seed === 'true') {
    mode = '--seed';
}
if (process.env.npm_config_wipe === 'true') {
    mode = '--wipe';
}
if (process.env.npm_config_clean === 'true') {
    mode = '--clean';
}
if (!mode) {
    const param = await askParam();
    switch (param) {
        case "s":
        case "S":
        case "seed":
            mode = '--seed';
            break;
        case "W":
        case "wipe":
            mode = '--wipe';
            break;
        case "clean":
        case "CS":
            mode = '--clean';
            break;
        default:
            abort();
    }
}

switch (mode) {
    case "--seed":
        log.success("Seeding database...");
        await importData();
        exit();
        break;
    case "--wipe":
        const confirmWipe = await confirm(`This will delete all models in db, confirm?`)
        if (confirmWipe) {
            log.error("Wiping database...");
            await deleteData();
            exit();
        } else {
            abort();
        }
        break;
    case "--clean":
        const confirmCI = await confirm(`This will delete all models in db and re-seed, confirm?`);
        if (confirmCI) {
            log.error("Wiping database...");
            await deleteData();
            log.success("Seeding database...");
            await importData();
            exit();
        } else {
            abort();
        }
        break;
    default:
        abort();
}