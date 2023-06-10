import { Request, Response } from "express";
import { Ticket } from "../models/ticket";

export const findAllTickets = async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  res.send(tickets);
};
