import jwt from "jsonwebtoken";
import { JWT_EXPIRY, JWT_SECRET } from "./constants";
import { sanitizeResponse } from "./sanitize";
import bcrypt from "bcrypt";

export class Utils {
    /**
   *
   * @param ms
   * @returns void
   *
   * @Description : Testing methods for halting Thread
   */
  public static async Sleep(ms: number) {
    return new Promise((resolve: any, reject: any) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  public static generateToken(payload: object) {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    return token;
  }

  public static getResponse(
    message: string,
    status_code: number,
    data: object = {}
  ) {
    const body: { message: string; data?: object } = {
      message,
    };

    if (Object.keys(data).length) {
      body.data = sanitizeResponse(data);
    }

    return {
      status_code,
      body,
    };
  }

  public static hashPassword = async (password: string) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  };

  public static verifyPassword = async (
    password: string,
    hashedPassword: string
  ) => {
    return await bcrypt.compare(password, hashedPassword);
  };
}