import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { signUpRouter } from "./routes/signup";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/error-handling";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.use(json());
app.set("trust proxy", true);

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
app.use(errorHandler);
app.all("*", async () => {
  throw new NotFoundError();
});

export { app };
