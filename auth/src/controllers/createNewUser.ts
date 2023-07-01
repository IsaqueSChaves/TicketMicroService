import { BadRequestError } from "@isctickets/common";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    return res.status(201).send(user);
  } catch (err) {
    return next(err);
  }
};
