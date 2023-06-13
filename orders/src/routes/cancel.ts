import {
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@isctickets/common";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { Router, Request, Response, NextFunction } from "express";
import { Order, OrderStatus } from "../models/order";
import { natsWrapper } from "../natsWrapper";

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

      new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id.toString(),
        ticket: {
          id: order.ticket.id.toString(),
        },
      });

      return res.status(204).send({});
    } catch (error) {
      next(error);
    }
  }
);

export { router as cancelOrder };
