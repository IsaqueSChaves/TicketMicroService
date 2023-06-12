import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@isctickets/common";
import { Router, Request, Response, NextFunction } from "express";
import { Order } from "../models/order";

const router = Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await Order.findById(req.params.orderId).populate("ticket");
      if (!order) {
        throw new NotFoundError();
      }

      if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      }
      return res.status(200).send(order);
    } catch (error) {
      next(error);
    }
  }
);

export { router as findOrderById };
