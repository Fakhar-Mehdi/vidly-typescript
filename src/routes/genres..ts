import express from "express";
import { isEmpty } from "lodash";
import Genre from "../models/genres";
import { Request, Response } from "express";

const genreRouter = express.Router();

genreRouter.get("/", async (req: Request, res: Response) => {
  try {
    const allGenres = await Genre.find();
    return !isEmpty(allGenres)
      ? res.send(allGenres)
      : res.status(404).send(`No Genres Found`);
  } catch (e: any) {
    console.log(`No Genres Found.\nFollowing Error Occurred: ${e.message}`);
    res.send(`No Genres Found.\nFollowing Error Occurred: ${e.message}`);
  }
});

genreRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error("id not Found");
    const genre = await Genre.findById(id);
    if (!genre) throw new Error("genre not Found");
    res.send(genre);
  } catch (e: any) {
    console.log(`Id not Found\nFollowing error occurred: ${e.message}`);
    res.send(`Id not Found\nFollowing error occurred: ${e.message}`);
  }
});

genreRouter.post("/", async (req: Request, res: Response) => {
  try {
    //validate genre
    const genre = new Genre({ genre: req.body.name });
    //add it to db
    const result = await genre.save();

    //return response
    res.send(`New Genre Added: ${result}`);
    console.log(`${result}\nis now successfully added`);
  } catch (e: any) {
    console.log(
      `Unable to add the genre.\nFollowing error occurred${e.message}`
    );
    res.send(`Unable to add the genre.\nFollowing error occurred${e.message}`);
  }
});

genreRouter.put("/", async (req: Request, res: Response) => {
  try {
    const { _id, name } = req.body;
    // validate id
    if (!_id) throw new Error("id not Found");
    //update course
    const previousGenre = await Genre.findOneAndUpdate(
      { _id },
      { genre: name }
    );
    // send response
    res.send(`${previousGenre} is now successfully updated with provided values.`);
  } catch (e: any) {
    console.log(
      `Unable to update the customer.\nFollowing Error Occurred: ${e.message}`
    );
    res.send(
      `Unable to update the customer.\nFollowing Error Occurred: ${e.message}`
    );
  }
});

genreRouter.put("/:_id", async (req: Request, res: Response) => {
  const { _id } = req.params;
  const { name } = req.body;
  try {
    //validate id
    if (!_id) throw new Error("id not Found");
    //update
    const previousGenre = await Genre.findByIdAndUpdate(_id, { genre: name });
    //send response
    res.send(`${previousGenre} is now successfully updated with provided values.`);
  } catch (e: any) {
    console.log(
      `Unable to update the customer.\nFollowing Error Occurred: ${e.message}`
    );
    res.send(
      `Unable to update the customer.\nFollowing Error Occurred: ${e.message}`
    );
  }
});

genreRouter.delete("/:_id", async (req: Request, res: Response) => {
  const { _id } = req.params;
  try {
    //validateId
    if (!_id) throw new Error("id not Found");
    //remove
    const result = await Genre.deleteOne({ _id });
    //send response
    res.send(`${result} is now successfully deleted`);
  } catch (e: any) {
    console.log(`Id not Found\nFollowing error occurred: ${e.message}`);
    res.send(`Id not Found\nFollowing error occurred: ${e.message}`);
  }
});

genreRouter.delete("/", async (req: Request, res: Response) => {
  const { _id } = req.body;
  try {
    //validateId
    if (!_id) throw new Error("id not Found");
    //remove
    const result = await Genre.findOneAndDelete({ _id });
    //send response
    res.send(`${result} is now successfully deleted`);
  } catch (e: any) {
    console.log(`Id not Found\nFollowing error occurred: ${e.message}`);
    res.send(`Id not Found\nFollowing error occurred: ${e.message}`);
  }
});

export default genreRouter;
