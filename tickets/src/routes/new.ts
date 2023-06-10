import { requireAuth, validateRequest } from "@isctickets/common";
import { createTicket } from "../controllers/createTicket";
import { body } from "express-validator";
import { Router } from "express";

const router = Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  createTicket
);

export { router as createTicketRouter };
