import { Router } from "express";

const router = Router();

router.get("/api/users/currentuser/", (req, res) => {
  res.send("Current user");
});

export { router as currentUserRouter };
