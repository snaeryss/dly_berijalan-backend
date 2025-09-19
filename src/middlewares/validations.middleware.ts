import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const MValidate = (
    schema: Joi.ObjectSchema
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const validateError = error.details.map((detail) => {
        return Error(detail.message);
      })[0];

      return next(validateError);
    }

    next();
  };
};



