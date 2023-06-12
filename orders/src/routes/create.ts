import { Router, Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@isctickets/common";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { body } from "express-validator";

const router = Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [body("ticketId").not().isEmpty().withMessage("TicketId is required")],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ticketId } = req.body;

      // Find the ticket the user is trying to order in the database
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        throw new NotFoundError();
      }

      // Make sure that this ticket is not already reserved
      const isReserved = await ticket.isReserved();
      if (isReserved) {
        throw new BadRequestError("Ticket is already reserved");
      }

      // Calculate an expiration date for this order
      const expiration = new Date();
      expiration.setSeconds(
        expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS
      );

      // Build the order and save it to the database
      const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket,
      });
      await order.save();

      // Publish an event saying that an order was created

      return res.status(201).send(order);
    } catch (err) {
      next(err);
    }
  }
);

export { router as createOrder };