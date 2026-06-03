import mongoose from 'mongoose';
import log from "../src/utils/niceConsole.ts";

const connectDB = async (uri:string, consoleLog = true) => {
    const connexion = await mongoose.connect(uri);

    consoleLog && log.info(`MongoDB Connected to ${connexion.connection.host}`);
};

export default connectDB;
