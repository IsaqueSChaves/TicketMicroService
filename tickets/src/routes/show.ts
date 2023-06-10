import { findTicketById } from "../controllers/findTicketById";
import { Router } from "express";

const router = Router();

router.get("/api/tickets/:id", findTicketById);

export { router as showTicketRouter };
