import { validate } from "../middlewares/global-middleware";
import { Router } from "express";
import { body } from "express-validator";
import { create } from "../middlewares/global-middleware";

const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail(),
    body("password").trim().isLength({ min: 4, max: 20 }),
  ],
  validate,
  create
);

export { router as signUpRouter };
