import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../utils/constants";
import { Utils } from "../utils/utils";
import { Request, Response, NextFunction } from "express";
import { db } from "../DB";
import { IUser } from "../modules/User/model/IUser";
import { ObjectId } from "mongodb";

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
        console.log("Token payload:", payload);
    } catch (error) {
        console.log("Token verification failed:", error);
        const { status_code, body } = Utils.getResponse(
            "Authentication error",
            401
        );

        return res.status(status_code).json(body);
    }
    if (!payload.userId) {
        console.log("Payload does not contain userId");
        const { status_code, body } = Utils.getResponse("Authentication error", 401);
        return res.status(status_code).json(body);
    }

    const user = await db.users.findOne({ _id: new ObjectId(payload.userId) });

    if (!user) {
        const { status_code, body } = Utils.getResponse(
            "User not found",
            401
        );

        return res.status(status_code).json(body);
    }

    req.user = user;

    next();
}