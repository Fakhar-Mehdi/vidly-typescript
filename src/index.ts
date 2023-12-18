import express from "express";
import moviesRouter from "./routes/movies";
import genreRouter from "./routes/genres.";
import { connectAndListen } from "./helper";
import customerRouter from "./routes/customer";

const genreHomePath = "/api/genres";
const moviesHomePath = "/api/movies";
const customersHomePath = "/api/customers";

const app = express();
app.use(express.json());
app.use(genreHomePath, genreRouter);
app.use(moviesHomePath, moviesRouter);
app.use(customersHomePath, customerRouter);
connectAndListen(app);
