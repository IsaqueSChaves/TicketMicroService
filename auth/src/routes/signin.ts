import { Router } from "express";

const router = Router();

router.post("/api/users/signin", (req, res) => {
  const { email, password } = req.body;
});

export { router as signInRouter };
