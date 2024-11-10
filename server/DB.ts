import { DBConfigMongo } from "./configs/database";
import { Db, MongoClient } from "mongodb";
import { IUser } from "./modules/User/model/IUser";
import { IPoll } from "./modules/Poll/model/IPoll";

class DB {
    private mongoClient!: MongoClient;
    private db!: Db;

    connect = async (dbConf: DBConfigMongo) => {
        try {
            if (dbConf.atlas) {
                this.mongoClient = await MongoClient.connect(dbConf.uri, {
                    retryWrites: true,
                    w: "majority",
                });
                this.db = this.mongoClient.db(dbConf.dbname);
            }

            // Set up event listeners
            this.mongoClient.on("serverDescriptionChanged", (event) => {
                console.log("Server description changed:", event);
            });
            this.mongoClient.on("serverHeartbeatStarted", (event) => {
                console.log("Server heartbeat started:", event);
            });
            this.mongoClient.on("serverHeartbeatSucceeded", (event) => {
                console.log("Server heartbeat succeeded:", event);
            });
            this.mongoClient.on("serverHeartbeatFailed", (event) => {
                console.error("Server heartbeat failed:", event);
            });
            this.mongoClient.on("serverOpening", (event) => {
                console.log("Server opening:", event);
            });
            this.mongoClient.on("serverClosed", (event) => {
                console.log("Server closed:", event);
            });
            this.mongoClient.on("close", () => {
                console.log("Connection closed");
            });
            this.mongoClient.on("timeout", () => {
                console.error("Connection timeout");
            });

            return this.db;
        } catch (error) {
            console.error("MongoDB connection error:", error);
            throw error;
        }
    };

    get users() {
        return this.db.collection<IUser>("users");
    }
    get polls() {
        return this.db.collection<IPoll>("polls")
    }

    getDB(): Db {
        if (!this.db) {
            throw new Error("Database not connected");
        }
        return this.db;
    };

    async close() {
        if (this.mongoClient) {
            await this.mongoClient.close();
            console.log("Database connection closed");
        }
    };

}

const db = new DB();

export { db };
