import { TicketCreatedPublisher } from "../events/publishers/ticketCreatedPublisher";
import { natsWrapper } from "../natsWrapper";
import { Request, Response } from "express";
import { Ticket } from "../models/ticket";

export const createTicket = async (req: Request, res: Response) => {
  const { title, price } = req.body;

  const ticket = Ticket.build({
    title,
    price,
    userId: req.currentUser!.id,
  });

  await ticket.save();
  
  await new TicketCreatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
  });

  res.status(201).send(ticket);
};
