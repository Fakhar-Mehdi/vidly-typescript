import Joi from "joi";

export const validateId = (id: number, movieGenres: string[]) =>
  typeof id === "number" && !isNaN(id) && id > 0 && id <= movieGenres.length;

export const validateGenre = (genre: string) =>
  Joi.object({ genre: Joi.string().required() }).validate({ genre });
