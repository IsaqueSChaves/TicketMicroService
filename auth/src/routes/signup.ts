import { Router, Request, Response } from "express";
import { validate } from "../middlewares/global-middleware";
import { body } from "express-validator";

const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail(),
    body("password").trim().isLength({ min: 4, max: 20 }),
  ],
  validate,
  async (req: Request, res: Response) => {
    console.log("Creating user...");

    const { email, password } = req.body;
    res.status(200).send({ email, password });
  }
);

export { router as signUpRouter };
