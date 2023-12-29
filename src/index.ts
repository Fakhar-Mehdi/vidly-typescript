import express from "express";
// import usersRouter from "./routes/users";
// import loginRouter from "./routes/auth";
// import moviesRouter from "./routes/movies";
// import genreRouter from "./routes/genres.";
// import { connectAndListen } from "./helper";
// import rentalsRouter from "./routes/rentals";
// import customersRouter from "./routes/customers";
import dotenv from "dotenv";
// import error from "./middleware/error";
// import winston from "winston";
// import w from "winston-mongodb";
import startup from "./startup/routes";
import connectAndListen from "./startup/db";
import logger from "./startup/logging";
import config from "./startup/config";
//------------------------------------

//------------------------------------
dotenv.config();

// if (!process.env.vidly_jwtPrivateKey) {
//   throw new Error("FATAL ERROR: private key is not defined");
// }
config();
// winston.configure({
//   transports: [
//     new w.MongoDB({ db: "mongodb://localhost/vidly" }),
//     new winston.transports.File({
//       filename: "vidly.log",
//       //False because we want to exit the process
//       // handleExceptions: true,
//       // handleRejections: true,
//     }),
//     new winston.transports.Console(),
//   ],
// });

// process.on("uncaughtException", () => {
//   winston.error("Uncaught Exception is caught here");
//   process.exit(1);
// });

// process.on("unhandledRejection", () => {
//   winston.error("Unhandled Rejection is caught here");
//   process.exit(1);
// });
logger();
// const usersHomePath = "/api/users";
// const loginHomePath = "/api/auth";
// const genresHomePath = "/api/genres";
// const moviesHomePath = "/api/movies";
// const rentalsHomePath = "/api/rentals";
// const customersHomePath = "/api/customers";
const app = express();
startup(app);
connectAndListen(app);
// app.use(express.json());
// app.use(usersHomePath, usersRouter);
// app.use(loginHomePath, loginRouter);
// app.use(genresHomePath, genreRouter);
// app.use(moviesHomePath, moviesRouter);
// app.use(rentalsHomePath, rentalsRouter);

// app.use(customersHomePath, customersRouter);

// app.use(error);
// connectAndListen(app);
