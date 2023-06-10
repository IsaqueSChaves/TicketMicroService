import { NotFoundError } from "@isctickets/common";
import { Request, Response } from "express";
import { Ticket } from "../models/ticket";

export const findTicketById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new NotFoundError();
  }
  res.send(ticket);
};
