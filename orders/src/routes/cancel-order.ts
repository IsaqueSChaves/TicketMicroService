import { Router, Request, Response } from "express";

const router = Router();

router.delete("/api/orders/:id", async (req: Request, res: Response) => {
    
});

export { router as cancelOrder };
