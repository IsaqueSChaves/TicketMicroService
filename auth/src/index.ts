import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
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
    secure: true,
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

const port = 2500;

const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret is required");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
  app.listen(port, () => {
    console.log(`Listening on ${port}!`);
  });
};

start();
