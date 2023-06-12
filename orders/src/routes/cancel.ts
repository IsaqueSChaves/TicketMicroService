import {
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@isctickets/common";
import { Order, OrderStatus } from "../models/order";
import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.delete(
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
      order.status = OrderStatus.Cancelled;
      await order.save();

      return res.status(204).send({});
    } catch (error) {
      next(error);
    }
  }
);

export { router as cancelOrder };
