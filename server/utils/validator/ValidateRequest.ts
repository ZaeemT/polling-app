import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const validateRequestBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.validate(req.body, {
      abortEarly: false,
      convert: true,
      stripUnknown: true,
    });

    if (result.error) {
      const errorDetails = result.error.details.map((error) => ({
        key: error.context?.key,
        message: error.message.replace(/"/g, ""),
      }));

      return res.status(400).json({
        errors: errorDetails,
      });
    }

    req.body = result.value;

    next();
  };
};

export const validateRequestParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.validate(req.query, {
      abortEarly: false,
      convert: true,
      stripUnknown: true,
    });

    if (result.error) {
      const errorDetails = result.error.details.map((error) => ({
        key: error.context?.key,
        message: error.message.replace(/"/g, ""),
      }));

      return res.status(400).json({
        errors: errorDetails,
      });
    }

    req.query = result.value;

    next();
  };
};
