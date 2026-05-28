import mongoose from 'mongoose';
import log from "../utils/niceConsole.ts";

const uri = process.env.MONGODB_URI ?? '';

const connectDB = async () => {
    const connexion = await mongoose.connect(uri);

    log.info(`MongoDB Connected to ${connexion.connection.host}`);
};

export default connectDB;
