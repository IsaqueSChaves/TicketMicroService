import { ValidationError } from "express-validator";
import { CostumError } from "./costum-errors";

export class RequestValidationError extends CostumError {
  statusCode: number = 400;
  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}
