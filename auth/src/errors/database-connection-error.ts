import { ValidationError } from "express-validator";
import { CostumError } from "./costum-errors";

export class DataBaseConnectionError extends CostumError {
  statusCode: number = 500;
  constructor(public errors: ValidationError[]) {
    super("Error connecting to Database");

    Object.setPrototypeOf(this, DataBaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: "Error connecting to database" }];
  }
}

