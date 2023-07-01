import { TicketCreatedPublisher } from "../events/publishers/ticketCreatedPublisher";
import { NextFunction, Request, Response } from "express";
import { natsWrapper } from "../natsWrapper";
import { Ticket } from "../models/ticket";

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      version: ticket.version,
      price: ticket.price,
      userId: ticket.userId,
    });

    return res.status(201).send(ticket);
  } catch (err) {
    next(err);
  }
};
