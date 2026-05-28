import 'dotenv/config';
import {app} from "./src/index.ts";
import connectDB from "./src/config/db.ts";
import dns from "node:dns";
import log from "./src/utils/niceConsole.ts";

// prevents connexion error when running dev on local due to pihole
if (process.env.NODE_ENV !== "production") {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const PORT = process.env.PORT || 5000;

void connectDB();

const server = app.listen(
    PORT,
    () => {
        log.success(`Server running in ${process.env.NODE_ENV} mode at http://localhost:${PORT}`)
    }
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error, promise) => {
    log.error(`Error: ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});