import Movie from "../models/movies";
import express, { Request, Response } from "express";
import Genre from "../models/genres";
import authenticateUser from "../middleware/authenticateUser";
import authenticateAdmin from "../middleware/authenticateAdmin";
import {
  deleteObject,
  getAll,
  getById,
  throwException,
  updateMovie,
} from "../helper";
import { asyncMiddlewareFunction } from "../middleware/asyncMiddlewareFunction";
import w from "winston";

const moviesRouter = express.Router();

moviesRouter.get(
  "/",
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    await getAll(res, Movie, "Movie");
  })
);

moviesRouter.get(
  "/:_id",
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    await getById(req, res, Movie, "Movie");
  })
);

moviesRouter.delete(
  "/",
  [authenticateUser, authenticateAdmin],
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    await deleteObject(req, res, true, Movie);
  }, "\nUnable to deleteObject the Movie\n")
);

moviesRouter.delete(
  "/:_id",
  [authenticateUser, authenticateAdmin],
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    await deleteObject(req, res, false, Movie);
  }, "\nUnable to deleteObject the Movie.\n")
);

moviesRouter.post(
  "/",
  authenticateUser,
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    const { title, genreId, numberInStock, dailyRentalRate } = req.body;
    const genre: any = await Genre.findById(genreId);
    if (!genre) throwException(res, "No genre found", 404);
    const newMovie = new Movie({
      title,
      numberInStock,
      dailyRentalRate,
      genre: {
        _id: genre._id,
        genre: genre.genre,
      },
    });
    const result = await newMovie.save();
    if (!result) throwException(res);
    res.send(`${result} is successfully added now`);
    w.info(`${result}\nis now successfully added`);
  }, "\nUnable to add the movie.\n")
);

moviesRouter.put(
  "/",
  authenticateUser,
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
   await updateMovie(req, res, false);
    // const { _id, title, genreId, numberInStock, dailyRentalRate } = req.body;
    // if (genreId) {
    //   var genre: any = await Genre.findById(genreId);
    //   if (!genre) throwException(res, "No genre found", 404);
    // }
    // if (!_id) throwException(res, "Id not Found", 400);
    // const previousMovie: any = await Movie.findById(_id);
    // if (!previousMovie) throwException(res, "Invalid Id", 404);
    // const result = await Movie.findByIdAndUpdate(
    //   { _id },
    //   {
    //     title,
    //     numberInStock,
    //     dailyRentalRate,
    //     genre: genreId
    //       ? { _id: genre._id, genre: genre.genre }
    //       : {
    //           _id: previousMovie.genre._id,
    //           genre: previousMovie.genre.genre,
    //         },
    //   }
    // );
    // if (!result) throwException(res);
    // res.send(`${result} is successfully updated`);
  }, "\nUnable to update the movie.\n")
);

moviesRouter.put(
  "/:_id",
  authenticateUser,
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
   await updateMovie(req, res, true);

    //   const { title, genreId, numberInStock, dailyRentalRate } = req.body;
    //   const { _id } = req.params;
    //   if (genreId) {
    //     var genre: any = await Genre.findById(genreId);
    //     if (!genre) throw new Error("No genre found");
    //   }
    //   if (!_id) throwException(res, "Id not Found", 400);
    //   const previousMovie: any = await Movie.findById(_id);
    //   if (!previousMovie) throwException(res, "Invalid Id", 404);
    //   const result = await Movie.findByIdAndUpdate(
    //     { _id },
    //     {
    //       title,
    //       numberInStock,
    //       dailyRentalRate,
    //       genre: genreId
    //         ? { _id: genre._id, genre: genre.genre }
    //         : {
    //             _id: previousMovie.genre._id,
    //             genre: previousMovie.genre.genre,
    //           },
    //     }
    //   );
    //   if (!result) throwException(res);
    //   res.send(`${result} is successfully updated`);
  }, "\nUnable to update the movie.\n")
);
export default moviesRouter;
