import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import jwt from "jsonwebtoken";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  console.log("Validating");

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("Not valid data");
    throw new RequestValidationError(errors.array());
  }

  return next();
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError("Email in use");
  }

  const user = User.build({ email, password });
  await user.save();

  //Generate JWT
  const userJwt = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET!
  );
  req.session = {
    jwt: userJwt,
  };

  return res.status(201).send(user);
};
