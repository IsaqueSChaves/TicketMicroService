import { Router, Request, Response, NextFunction } from "express";
import { requireAuth } from "@isctickets/common";
import { Order } from "../models/order";

const router = Router();

router.get(
  "/api/orders",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await Order.find({
        userId: req.currentUser!.id,
      }).populate("ticket");
      return res.status(200).send(orders);
    } catch (err) {
      next(err);
    }
  }
);

export { router as findOrders };
