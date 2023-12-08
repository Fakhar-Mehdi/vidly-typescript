import express from "express";
import { Request, Response } from "express";
import { validateId, validateGenre } from "../helper";
import movieGenres from "../data";

let tempMovieGenres = movieGenres;

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  const { genre } = req.body;
  const { error } = validateGenre(genre);
  if (!error) {
    tempMovieGenres = tempMovieGenres.concat(genre);
    return res.send(
      `Genre is added as \n${JSON.stringify({
        id: tempMovieGenres.length,
        genre,
      })}`
    );
  } else
    return res
      .status(400)
      .send(
        `Invalid Genre\nYou Entered: Genre=${genre}\nHere's the error: ${error}`
      );
});

router.put("/", (req: Request, res: Response) => {
  const { genre } = req.body;
  const id = parseInt(req.body.id);
  const { error } = validateGenre(genre);

  if (validateId(id, tempMovieGenres) && !error) {
    const oldGenre = tempMovieGenres[id - 1];
    tempMovieGenres[id - 1] = genre;
    return res.send(
      `${oldGenre} is updated to ${genre} while the id is same as ${id} `
    );
  } else
    return res
      .status(400)
      .send(`Invalid id or Genre\nYou Entered: id=${id}, Genre=${genre}`);
});

router.put("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { genre } = req.body;
  if (validateId(id, tempMovieGenres) && validateGenre(genre)) {
    const oldGenre = tempMovieGenres[id - 1];
    tempMovieGenres[id - 1] = genre;
    return res.send(
      `${oldGenre} is updated to ${genre} while the id is same as ${id} `
    );
  } else
    return res
      .status(400)
      .send(`Invalid id or Genre\nYou Entered: id=${id}, Genre=${genre}`);
});

router.get("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (validateId(id, tempMovieGenres)) return res.send(tempMovieGenres[id - 1]);
  else return res.status(404).send(`Genre ${id} not found`);
});

router.get("/", (req: Request, res: Response) => res.send(tempMovieGenres));

router.delete("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (validateId(id, tempMovieGenres)) {
    const oldGenre = tempMovieGenres[id - 1];
    tempMovieGenres.splice(id - 1, 1);
    return res.send(
      `${JSON.stringify({ id, genre: oldGenre })} is successfully deleted!`
    );
  } else return res.status(404).send(`Genre: ${id} not Found`);
});

router.delete("/", (req: Request, res: Response) => {
  const id = parseInt(req.body["id"]);
  if (validateId(id, tempMovieGenres)) {
    const oldGenre = tempMovieGenres[id - 1];
    tempMovieGenres.splice(id - 1, 1);
    return res.send(
      `${JSON.stringify({ id, genre: oldGenre })} is successfully deleted!`
    );
  } else return res.status(404).send(`Genre: ${id} not Found`);
});

export default router;
