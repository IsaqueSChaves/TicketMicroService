import { CostumError } from "./costum-errors";

export class NotAuthorizedError extends CostumError {
  statusCode = 401;

  constructor() {
    super("Not authorized");
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not Authorized" }];
  }
}
