import express from "express";
import Genre from "../models/genres";
import { Request, Response } from "express";
import authenticateUser from "../middleware/authenticateUser";
import authenticateAdmin from "../middleware/authenticateAdmin";
import { asyncMiddlewareFunction } from "../middleware/asyncMiddlewareFunction";
import {
  deleteObject,
  getAll,
  getById,
  throwException,
  updateGenre,
} from "../helper";
import w from "winston";

const genreRouter = express.Router();

genreRouter.get(
  "/",
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    await getAll(res, Genre, "Genre");
  })
);

genreRouter.get(
  "/:_id",
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    await getById(req, res, Genre, "Genre");
  })
);

genreRouter.post(
  "/",
  authenticateUser,
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    const genre = new Genre({ genre: req.body.name });
    const result = await genre.save();
    if (!result) throwException(res);
    res.send(`New Genre Added: ${result}`);
    w.info(`${result}\nis now successfully added`);
  }, "\nUnable to add the genre.\n")
);

genreRouter.put(
  "/",
  authenticateUser,
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    await updateGenre(req, res, false);
  }, "\nUnable to update the customer.\n")
);

genreRouter.put(
  "/:_id",
  authenticateUser,
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    await updateGenre(req, res, true);
  }, "\nUnable to update the customer\n")
);

genreRouter.delete(
  "/",
  [authenticateUser, authenticateAdmin],
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    await deleteObject(req, res, true, Genre);
  })
);

genreRouter.delete(
  "/:_id",
  [authenticateUser, authenticateAdmin],
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    await deleteObject(req, res, false, Genre);
  })
);

export default genreRouter;
