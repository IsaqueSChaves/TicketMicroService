import { Router, Request, Response } from "express";

const router = Router();

router.get("/api/orders/:id", async (req: Request, res: Response) => {
    
});

export { router as findOrderById };
