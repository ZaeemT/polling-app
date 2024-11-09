import dotenv from "dotenv";
import { db } from "./DB";
import { httpServer } from "./http";
import { httpConfig } from "./configs/http";
import { DBConfig } from "./configs/database";

dotenv.config();
export class Application {
    constructor() { }

    public async initializeApp() {
        try {
            await db.connect(DBConfig.dbconf);
            console.log("Connected to MongoDB Atlas successfully");

            httpServer.init(httpConfig);

            process.on("SIGTERM", async () => {
                console.log("SIGTERM signal received");
                await httpServer.stopServer();
            });

            process.on("SIGINT", async () => {
                console.log("SIGINT signal received");
                await httpServer.stopServer();
            });

        } catch (error) {
            console.error("Failed to initialize application:", error);
            process.exit(1);
        }
    }
}
