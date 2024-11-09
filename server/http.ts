import express from "express";
import cors from "cors";
import { createServer, Server } from "http";
import stoppable from "stoppable";
import { HTTPCONF } from "./configs/http";
import { router as AuthRouter } from "./modules/Auth/routes/api/v1";

export class HttpServer {
    app = express();
    private server!: Server;

    init(conf: HTTPCONF) {
        this.registerRouter();
        this.startServer(conf.PORT);
    }

    registerRouter() {
        this.app.use(cors({ allowedHeaders: "*", origin: "*" }));
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json());
        this.app.use("/api/v1", AuthRouter)

    }

    startServer(port: number) {
        this.server = stoppable(createServer(this.app));

        this.server.listen(port, () => {
            console.log(`Server Started on Port : ${port}`);
        });

        this.server.on("close", () => {
            console.log("Server Close Fired");
            process.exit(1);
        });
    }

    async stopServer() {
        console.log("Stopping Server");
        if (!this.server) {
            process.exit(1);
        }
        this.server.close();
    }
}

const httpServer = new HttpServer();

export { httpServer };
