import { isEmpty } from "lodash";
import Movie from "../models/movies";
import express, { Request, Response } from "express";
import Genre from "../models/genres";
import authenticateUser from "../middleware/authenticateUser";
import authenticateAdmin from "../middleware/authenticateAdmin";

const moviesRouter = express.Router();

moviesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const movies = await Movie.find();
    return isEmpty(movies)
      ? res.status(404).send("No Movies Found")
      : res.send(movies);
  } catch (e: any) {
    console.log(`No Movies Found.\nFollowing Error Occurred: ${e.message}`);
    res.send(`No Movies Found.\nFollowing Error Occurred: ${e.message}`);
  }
});

moviesRouter.get("/:_id", async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    if (!_id) throw new Error("Id not Found");
    const movie = await Movie.find({ _id });
    if (!movie) throw new Error("Movie not Found");
    res.send(movie);
  } catch (e: any) {
    console.log(`Movie Not Found.\nFollowing Error Occurred: ${e.message}`);
    res.send(`Movie Not Found.\nFollowing Error Occurred: ${e.message}`);
  }
});

moviesRouter.delete(
  "/",
  [authenticateUser, authenticateAdmin],
  async (req: Request, res: Response) => {
    try {
      const { _id } = req.body;
      if (!_id) throw new Error("Id not Found");
      const result = await Movie.findByIdAndDelete({ _id });
      if (!result) throw new Error("Movie not Found");
      res.send(`${result} is now successfully deleted`);
    } catch (e: any) {
      console.log(
        `Unable to delete the Movie.\nFollowing Error Occurred: ${e.message}`
      );
      res.send(
        `Unable to delete the Movie.\nFollowing Error Occurred: ${e.message}`
      );
    }
  }
);

moviesRouter.delete(
  "/:_id",
  [authenticateUser, authenticateAdmin],
  async (req: Request, res: Response) => {
    try {
      const { _id } = req.params;
      if (!_id) throw new Error("Id not Found");
      const result = await Movie.findByIdAndDelete({ _id });
      if (!result) throw new Error("Movie not Found");
      res.send(`${result} is now successfully deleted`);
    } catch (e: any) {
      console.log(
        `Unable to delete the Movie.\nFollowing Error Occurred: ${e.message}`
      );
      res.send(
        `Unable to delete the Movie.\nFollowing Error Occurred: ${e.message}`
      );
    }
  }
);

moviesRouter.post(
  "/",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const { title, genreId, numberInStock, dailyRentalRate } = req.body;
      const genre: any = await Genre.findById(genreId);
      if (!genre) throw new Error("No genre found against provided id");
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
      if (!result) throw new Error("Invalid Object");
      res.send(`${result} is successfully added now`);
      console.log(`${result}\nis now successfully added`);
    } catch (e: any) {
      console.log(
        `Unable to add the movie.\nFollowing error occurred: ${e.message}`
      );
      res.send(
        `Unable to add the movie.\nFollowing error occurred: ${e.message}`
      );
    }
  }
);

moviesRouter.put("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { _id, title, genreId, numberInStock, dailyRentalRate } = req.body;
    if (genreId) {
      var genre: any = await Genre.findById(genreId);
      if (!genre) throw new Error("No genre found against provided id");
    }
    if (!_id) throw new Error("Id not Found");
    const previousMovie: any = await Movie.findById(_id);
    if (!previousMovie) throw new Error("Invalid Id");
    const result = await Movie.findByIdAndUpdate(
      { _id },
      {
        title,
        numberInStock,
        dailyRentalRate,
        genre: genreId
          ? { _id: genre._id, genre: genre.genre }
          : {
              _id: previousMovie.genre._id,
              genre: previousMovie.genre.genre,
            },
      }
    );
    if (!result) throw new Error("Invalid Data");
    res.send(`${result} is successfully updated`);
  } catch (e: any) {
    console.log(
      `Unable to update the movie.\nFollowing Error Occurred: ${e.message}`
    );
    res.send(
      `Unable to update the movie.\nFollowing Error Occurred: ${e.message}`
    );
  }
});

moviesRouter.put(
  "/:_id",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const { title, genreId, numberInStock, dailyRentalRate } = req.body;
      const { _id } = req.params;
      if (genreId) {
        var genre: any = await Genre.findById(genreId);
        if (!genre) throw new Error("No genre found against provided id");
      }
      if (!_id) throw new Error("Id not Found");
      const previousMovie: any = await Movie.findById(_id);
      if (!previousMovie) throw new Error("Invalid Id");
      const result = await Movie.findByIdAndUpdate(
        { _id },
        {
          title,
          numberInStock,
          dailyRentalRate,
          genre: genreId
            ? { _id: genre._id, genre: genre.genre }
            : {
                _id: previousMovie.genre._id,
                genre: previousMovie.genre.genre,
              },
        }
      );
      if (!result) throw new Error("Invalid Data");
      res.send(`${result} is successfully updated`);
    } catch (e: any) {
      console.log(
        `Unable to update the movie.\nFollowing Error Occurred: ${e.message}`
      );
      res.send(
        `Unable to update the movie.\nFollowing Error Occurred: ${e.message}`
      );
    }
  }
);
export default moviesRouter;
