import { CostumError } from "./costum-errors";

export class BadRequestError extends CostumError {
  statusCode: number = 400;
  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
