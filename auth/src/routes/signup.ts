import { createNewUser } from "../controllers/createNewUser";
import { validateRequest } from "@isctickets/common";
import { body } from "express-validator";
import { Router } from "express";

const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail(),
    body("password").trim().isLength({ min: 4, max: 20 }),
  ],
  validateRequest,
  createNewUser
);

export { router as signUpRouter };
