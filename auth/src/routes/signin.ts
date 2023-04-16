import { Router } from "express";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import jwt from "jsonwebtoken";
import { Password } from "../services/password";
import { body } from "express-validator";
import { Request, Response } from "express";
import { validate } from "../middlewares/global-middleware";

const router = Router();

router.post(
  "/api/users/signin",
  [body("email").isEmail(), body("password").trim().notEmpty()],
  validate,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError("Invalid credentials");
    }

    //Autentication
    const passwordMatch = await Password.compare(user.password, password);
    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    //Generate Jwt token
    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!
    );
    req.session = {
      jwt: userJwt,
    };

    return res.status(200).send(user);
  }
);

export { router as signInRouter };
