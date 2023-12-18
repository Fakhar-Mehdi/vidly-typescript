import { genreSchema } from "./genres";
import mongoose, { Model, Document } from "mongoose";

interface IMoviesDoc extends Document {
  title: string;
  genre: { name: string };
  numberInStock: number;
  dailyRentalRate: number;
}

interface IMoviesModel extends Model<IMoviesDoc> {}

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 25,
    trim: true,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 100, 
    default: 0,
  },
});

const Movie : IMoviesModel = mongoose.model<IMoviesDoc, IMoviesModel>("Movies", movieSchema)

export default Movie