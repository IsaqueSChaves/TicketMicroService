import { errorHandler, currentUser } from "@isctickets/common";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import express from "express";
import "express-async-errors";

import { findOrderById } from "./routes/findById";
import { createOrder } from "./routes/create";
import { cancelOrder } from "./routes/cancel";
import { findOrders } from "./routes/findAll";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

app.use(findOrderById);
app.use(createOrder);
app.use(cancelOrder);
app.use(findOrders);

app.use(errorHandler);

export { app };
