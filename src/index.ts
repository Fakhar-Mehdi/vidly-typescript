import express from "express";
import usersRouter from "./routes/users";
import loginRouter from "./routes/auth";
import moviesRouter from "./routes/movies";
import genreRouter from "./routes/genres.";
import { connectAndListen } from "./helper";
import rentalsRouter from "./routes/rentals";
import customersRouter from "./routes/customers";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.vidly_jwtPrivateKey) {
  console.error("FATAL ERROR: private key is not defined");
  process.exit(1);
}

const usersHomePath = "/api/users";
const loginHomePath = "/api/auth";
const genresHomePath = "/api/genres";
const moviesHomePath = "/api/movies";
const rentalsHomePath = "/api/rentals";
const customersHomePath = "/api/customers";

const app = express();
app.use(express.json());
app.use(genresHomePath, genreRouter);
app.use(moviesHomePath, moviesRouter);
app.use(customersHomePath, customersRouter);
app.use(rentalsHomePath, rentalsRouter);
app.use(usersHomePath, usersRouter);
app.use(loginHomePath, loginRouter);
connectAndListen(app);
