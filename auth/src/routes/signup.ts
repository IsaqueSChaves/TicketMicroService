import { Router, Request, Response } from "express";
import { validate } from "../middlewares/global-middleware";
import { body } from "express-validator";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";

const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail(),
    body("password").trim().isLength({ min: 4, max: 20 }),
  ],
  validate,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    //controller

    const existingUser = await /* Service */ User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });
    await user.save();

    return res.status(201).send(user);
    //Controller fim
  }
);

export { router as signUpRouter };
