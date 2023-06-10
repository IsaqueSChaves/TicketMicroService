import { Router, Request, Response } from "express";

const router = Router();

router.post("/api/users/signout", async (req: Request, res: Response) => {
  req.session = null;
  return res.status(200).send({});
});

export { router as signOutRouter };
