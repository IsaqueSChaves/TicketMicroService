import { findAllTickets } from "../controllers/findAllTickets";
import { Router } from "express";

const router = Router();

router.get("/api/tickets", findAllTickets);

export { router as indexTicketRouter };
