import { NotFoundError, errorHandler } from "@isctickets/common";
import { currentUserRouter } from "./routes/currentUser";
import { signOutRouter } from "./routes/signout";
import { signInRouter } from "./routes/signin";
import { signUpRouter } from "./routes/signup";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import "express-async-errors";
import express from "express";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(signUpRouter);
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
