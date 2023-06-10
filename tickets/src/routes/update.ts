import { validateRequest, requireAuth } from "@isctickets/common";
import { updateTicket } from "../controllers/updateTickets";
import { body } from "express-validator";
import { Router } from "express";

const router = Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and must be greater than 0"),
  ],
  validateRequest,
  updateTicket
);

export { router as updateTicketRouter };
