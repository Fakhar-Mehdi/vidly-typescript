import mongoose from "mongoose";
import { Express, Request, Response } from "express";
import Joi from "joi";
import { isEmpty } from "lodash";
import Genre from "../models/genres";
import Movie from "../models/movies";
import Customer from "../models/customers";
import w from "winston";



export const throwException = (
  res: any,
  message: string = "Internal Server Error",
  code: number = 500
) => {
  res.status(code);
  throw new Error(message);
};

export const validateCredentials = (input: any) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(input);
};

export const deleteObject = async (
  req: Request,
  res: Response,
  body: boolean,
  BluePrint: any
) => {
  let _id;
  if (body) _id = req.body._id;
  else _id = req.params._id;
  if (!_id) throwException(res, "Id not Found", 400);
  const result = await BluePrint.findByIdAndDelete({ _id });
  if (!result) throwException(res);
  res.send(`${result} is now successfully deleted`);
};

export const getAll = async (res: Response, BluePrint: any, name: string) => {
  const result = await BluePrint.find();
  return isEmpty(result)
    ? res.status(404).send(`No ${name} Found`)
    : res.send(result);
};

export const getById = async (
  req: Request,
  res: Response,
  BluePrint: any,
  name: string
) => {
  const { _id } = req.params;
  if (!_id) throwException(res, "Id not Found", 400);
  const result = await BluePrint.findOne({ _id });
  if (!result) throwException(res, `${name} not Found`, 404);
  res.send(result);
};

export const updateGenre = async (
  req: Request,
  res: Response,
  hasParam: boolean
) => {
  let _id, name;
  if (hasParam) _id = req.params._id;
  else {
    _id = req.body?._id;
  }
  name = req.body?.name;
  if (!_id) throwException(res, "Id not Found", 400);
  const previousGenre = await Genre.findOneAndUpdate({ _id }, { genre: name });
  if (!previousGenre) throwException(res);
  res.send(
    `${previousGenre} is now successfully updated with provided values.`
  );
};

export const updateCustomer = async (
  req: Request,
  res: Response,
  hasParam: boolean
) => {
  let _id;
  if (hasParam) _id = req.params._id;
  else _id = req.body._id;

  const { name, isGold, phone } = req.body;

  if (!_id) throwException(res, "Id not Found", 400);
  const result = await Customer.findByIdAndUpdate(
    { _id },
    { name, isGold, phone }
  );
  if (!result) throwException(res);
  res.send(`${result} is now successfully updated with provided values.`);
};

export const updateMovie = async (
  req: Request,
  res: Response,
  hasParam: boolean
) => {
  let _id;
  if (hasParam) _id = req.params._id;
  else _id = req.body._id;
  const { title, genreId, numberInStock, dailyRentalRate } = req.body;
  if (genreId) {
    var genre: any = await Genre.findById(genreId);
    if (!genre) throwException(res, "No genre found", 404);
  }
  if (!_id) throwException(res, "Id not Found", 400);
  const previousMovie: any = await Movie.findById(_id);
  if (!previousMovie) throwException(res, "Invalid Id", 404);
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
  if (!result) throwException(res);
  res.send(`${result} is successfully updated`);
};
