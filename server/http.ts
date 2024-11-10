import express from "express";
import cors from "cors";
import { createServer, Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import stoppable from "stoppable";
import { HTTPCONF } from "./configs/http";
import { router as AuthRouter } from "./modules/Auth/routes/api/v1";
import { router as PollRouter } from "./modules/Poll/routes/api/v1";

export class HttpServer {
    app = express();
    private server!: Server;
    public io!: SocketIOServer;

    init(conf: HTTPCONF) {
        this.registerRouter();
        this.startServer(conf.PORT);
    }

    registerRouter() {
        this.app.use(cors({ allowedHeaders: "*", origin: "*" }));
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json());
        this.app.use("/api/v1", AuthRouter),
            this.app.use("/api/v1/poll", PollRouter)

    }

    startServer(port: number) {
        this.server = stoppable(createServer(this.app));

        this.io = new SocketIOServer(this.server, {
            cors: {
                origin: "*",
                // origin: process.env.FRONTEND_URL || 'http://localhost:5173',
                methods: ["GET", "POST"],
            },
        });

        // Set up Socket.IO event listeners
        this.io.on("connection", (socket) => {
            console.log(`User connected: ${socket.id}`);

            socket.on('joinPoll', (pollId: string) => {
                socket.join(`poll-${pollId}`);
            });

            socket.on('leavePoll', (pollId: string) => {
                socket.leave(`poll-${pollId}`);
            });

            socket.on("disconnect", () => {
                console.log(`User disconnected: ${socket.id}`);
            });
        });


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
