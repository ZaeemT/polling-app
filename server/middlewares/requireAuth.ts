import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../utils/constants";
import { Utils } from "../utils/utils";
import { Request, Response, NextFunction } from "express";
import { db } from "../DB";
import { IUser } from "../modules/User/model/IUser";

declare global {
    namespace Express {
        interface Request {
            user: IUser;
        }
    }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        const { status_code, body } = Utils.getResponse(
            "Authentication error",
            401
        );

        return res.status(status_code).json(body);
    }

    const token = bearer.replace("Bearer ", "");

    if (!token) {
        const { status_code, body } = Utils.getResponse(
            "Authentication error",
            401
        );

        return res.status(status_code).json(body);
    }

    let payload: JwtPayload;

    try {
        payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
        const { status_code, body } = Utils.getResponse(
            "Authentication error",
            401
        );

        return res.status(status_code).json(body);
    }

    const user = await db.users.findOne({ id: payload.userId });

    if (!user) {
        const { status_code, body } = Utils.getResponse(
            "Authentication error",
            401
        );

        return res.status(status_code).json(body);
    }

    req.user = user;

    next();
}