import { Router, Request, Response } from "express";

const router = Router();

router.get("/api/orders", async (req: Request, res: Response) => {
    return res.status(200).send({})
});

export { router as findOrders };
