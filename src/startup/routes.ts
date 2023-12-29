import express from "express";
import error from "../middleware/error";
import loginRouter from "../routes/auth";
import usersRouter from "../routes/users";
import moviesRouter from "../routes/movies";
import genreRouter from "../routes/genres.";
import rentalsRouter from "../routes/rentals";
import customersRouter from "../routes/customers";
import w from "winston";

const usersHomePath = "/api/users";
const loginHomePath = "/api/auth";
const genresHomePath = "/api/genres";
const moviesHomePath = "/api/movies";
const rentalsHomePath = "/api/rentals";
const customersHomePath = "/api/customers";

const startup = async (app: any) => {
  app.use(express.json());
  app.use(usersHomePath, usersRouter);
  app.use(loginHomePath, loginRouter);
  app.use(genresHomePath, genreRouter);
  app.use(moviesHomePath, moviesRouter);
  app.use(rentalsHomePath, rentalsRouter);

  app.use(customersHomePath, customersRouter);

  app.use(error);
  w.info("\nStartUp Done\n");
};

export default startup;
