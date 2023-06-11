import { Router, Request, Response } from "express";
import { requireAuth, validateRequest } from "@isctickets/common";
import { body } from "express-validator";

const router = Router();

router.post(
  "/api/orders",
  requireAuth,
  [body("ticketId").not().isEmpty().withMessage("TicketId is required")],
  validateRequest,
  async (req: Request, res: Response) => {}
);

export { router as createOrder };
