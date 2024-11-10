import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../utils/constants";
import { db } from "../DB";
import { IUser } from "../modules/User/model/IUser";



export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;

    // If no authorization header, continue without user
    if (!bearer) {
        return next();
    }

    const token = bearer.replace("Bearer ", "");

    // If no token after removing "Bearer ", continue without user
    if (!token) {
        return next();
    }

    let payload: JwtPayload;

    try {
        payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
        // If token is invalid, continue without user
        return next();
    }

    const user = await db.users.findOne({ id: payload.userId });

    // If user not found, continue without user
    if (!user) {
        return next();
    }

    // If everything is valid, attach user to request
    req.user = user;
    next();
}