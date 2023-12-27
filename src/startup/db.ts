import mongoose from "mongoose";
import { Express } from "express";

import w from "winston";

const connectToDb = async (connectionString: string) => {
  try {
    await mongoose.connect(connectionString);
    w.info("Connected to MongoDb");
  } catch (e) {
    w.error(`Following Error Occurred while connecting to MongoDb: ${e}`);
  }
};

const connectAndListen = async (app: Express) => {
  await connectToDb("mongodb://localhost/vidly");
  const port = process.env.PORT || 3000;

  await app.listen(port, () => w.info(`Listening to ${port}`));
};

export default connectAndListen;
