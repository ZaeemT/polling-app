export interface DBConfigMongo {
    atlas: boolean;
    uri: string;
    dbname: string;
}

import dotenv from 'dotenv';
dotenv.config();

export class DBConfig {
    public static dbconf = {
        atlas: true,
        uri: process.env.MONGO_URI?.replace('<db_password>', process.env.MONGO_PASSWORD || ''),
        dbname: process.env.MONGO_DB_NAME
    } as DBConfigMongo
}