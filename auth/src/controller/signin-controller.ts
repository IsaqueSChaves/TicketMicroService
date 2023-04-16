/*  import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../models/user";

export const createUser = async (req: Request, res: Response) => {
  //controller
  const { email, password } = req.body;

  const existingUser = await Service  User.findOne({ email });

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
  //Controller fim
};
 */