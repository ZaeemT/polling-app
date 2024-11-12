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

            this.mongoClient.on("serverDescriptionChanged", (event) => { });
            this.mongoClient.on("serverHeartbeatStarted", (event) => { });
            this.mongoClient.on("serverHeartbeatSucceeded", (event) => { });
            this.mongoClient.on("serverHeartbeatFailed", (event) => { });
            this.mongoClient.on("serverOpening", (event) => { });
            this.mongoClient.on("serverClosed", (event) => { });
            this.mongoClient.on("close", () => { });
            this.mongoClient.on("connectionClosed", (event) => { });
            this.mongoClient.on("connectionCreated", (event) => { });
            this.mongoClient.on("timeout", () => { });
            this.mongoClient.on("topologyOpening", (event) => { });
            this.mongoClient.on("topologyClosed", (event) => { });

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
