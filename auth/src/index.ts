import mongoose from "mongoose";
import { app } from "./app";

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
