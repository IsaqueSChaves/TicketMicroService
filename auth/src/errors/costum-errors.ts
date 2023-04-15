export abstract class CostumError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CostumError.prototype);
  }

  abstract serializeErrors(): {
    message: string;
    field?: string;
  }[];
}
