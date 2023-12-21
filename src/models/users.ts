import { pick } from "lodash";
import mongoose, { Model, Document } from "mongoose";
import jwt from "jsonwebtoken";

interface IUserDoc extends Document {
  name: string;
  email: string;
  password: string;
}

interface IUserModel extends Model<IUserDoc> {}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 30,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    minLength: 5,
    maxLength: 255,
    unique: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    // minLength: 8,
    maxLength: 1024,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.getAuthenticationToken = function () {
  return jwt.sign(
    pick(this, ["_id", "isAdmin"]),
    String(process.env.vidly_jwtPrivateKey)
  );
};

const User: IUserModel = mongoose.model<IUserDoc, IUserModel>(
  "Users",
  userSchema
);

export default User;
