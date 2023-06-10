import mongoose from "mongoose";
import { app } from "./app";

const port = 2500;
const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB at Auth");
  } catch (err) {
    console.error(err);
  }

  app.listen(port, () => {
    console.log(`Listening on port: ${port}!`);
  });
};

start();
