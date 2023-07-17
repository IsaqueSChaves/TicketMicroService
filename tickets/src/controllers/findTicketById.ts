import { NotFoundError } from "@isctickets/common";
import { Request, Response, NextFunction } from "express";
import { Ticket } from "../models/ticket";

export const findTicketById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
    }
    return res.status(200).send(ticket);
  } catch (err) {
    next(err);
  }
};
