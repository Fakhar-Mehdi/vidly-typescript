import mongoose, { Model, Document } from "mongoose";

interface IGenreDocument extends Document {
  genre: string;
}
interface IGenreModel extends Model<IGenreDocument> {}
export const genreSchema = new mongoose.Schema({
  genre: {
    type: String,
    required: true,
    minlength: 5,
    trim: true,
    lowercase: true,
    maxLength: 25,
  },
});

const Genre: IGenreModel = mongoose.model<IGenreDocument, IGenreModel>(
  "Genre",
  genreSchema
);

export default Genre;
