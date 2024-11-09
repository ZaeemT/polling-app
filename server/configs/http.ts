export interface HTTPCONF {

    PORT: number;
    // AllowCors: boolean;
    // GracefullShutdown: boolean
    // VAULT: boolean,
    // ServiceName: string,
    // QUEUE: "aws" | "rmq",
    // services?: {
    //     [key: string]: {
    //         host: string,
    //         port: string,
    //         protocol: string
    //     }
    // }
}

import dotenv from 'dotenv';
dotenv.config();

export const httpConfig: HTTPCONF = {
    PORT: parseInt(process.env.PORT || "3000")
};
