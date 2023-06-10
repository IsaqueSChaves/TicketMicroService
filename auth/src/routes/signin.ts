import { validateRequest, BadRequestError } from "@isctickets/common";
import { Request, Response, Router } from "express";
import { Password } from "../services/password";
import { body } from "express-validator";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

const router = Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({email});
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
