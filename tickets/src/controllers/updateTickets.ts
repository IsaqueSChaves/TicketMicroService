import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from "@isctickets/common";
import { TicketUpdatedPublisher } from "../events/publishers/ticketUpdatedPublisher";
import { Response, Request, NextFunction } from "express";
import { natsWrapper } from "../natsWrapper";
import { Ticket } from "../models/ticket";

export const updateTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (ticket.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket");
    }

    const { title, price } = req.body;

    ticket.set({
      title,
      price,
    });
    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    return res.status(200).send(ticket);
  } catch (err) {
    next(err);
  }
};
