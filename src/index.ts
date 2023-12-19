import express from "express";
import moviesRouter from "./routes/movies";
import genreRouter from "./routes/genres.";
import { connectAndListen } from "./helper";
import customersRouter from "./routes/customers";
import rentalsRouter from "./routes/rentals";

const genresHomePath = "/api/genres";
const moviesHomePath = "/api/movies";
const customersHomePath = "/api/customers";
const rentalsHomePath = "/api/rentals";

const app = express();
app.use(express.json());
app.use(genresHomePath, genreRouter);
app.use(moviesHomePath, moviesRouter);
app.use(customersHomePath, customersRouter);
app.use(rentalsHomePath, rentalsRouter);
connectAndListen(app);
