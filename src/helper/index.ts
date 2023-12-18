import mongoose from "mongoose";
import { Express } from "express";


export const connectToDb = async (connectionString: string) => {
  try {
    await mongoose.connect(connectionString);
    console.log("Connected to MongoDb");
  } catch (e) {
    console.log("Following Error Occurred while connecting to MongoDb: ", e);
  }
};

export const connectAndListen = async (app: Express) => {
  await connectToDb("mongodb://localhost/vidly");
  await app.listen("3000", () => console.log("Listening to 3000"));
};
