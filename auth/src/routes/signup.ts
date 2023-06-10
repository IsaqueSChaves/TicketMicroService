import { validateRequest, BadRequestError } from "@isctickets/common";
import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail(),
    body("password").trim().isLength({ min: 4, max: 20 }),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try{

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
      } catch(err){
        next(err)
      }
  }
);

export { router as signUpRouter };
