import { errorHandler, currentUser } from "@isctickets/common";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import express from "express";
import "express-async-errors";


import { createChargeRouter } from "./routes/create";

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

app.use("/api/payments", createChargeRouter);


app.use(errorHandler);

export { app };
