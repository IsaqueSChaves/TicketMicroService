import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "../errors/request-validation-error";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  console.log("Validating");

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  return next();
};
