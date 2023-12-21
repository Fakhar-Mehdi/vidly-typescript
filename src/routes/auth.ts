import express, { Request, Response } from "express";
import Joi from "joi";
import User from "../models/users";
import bcrypt from "bcrypt";

const loginRouter = express.Router();

loginRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { error } = validateCredentials(req.body);
    if (error) throw new Error("invalid Email or Pasword");
    const { email, password } = req.body;
    const user: any = await User.findOne({ email });
    if (!user) throw new Error("invalid Email");
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) throw new Error("invalid Email or Password");
    const token = user.getAuthenticationToken();
    res.header("x-auth-token", token).send(`Login Successful`);
  } catch (e: any) {
    console.log(`ERROR: ${e.message}`);
    res.send(`ERROR: ${e.message}`);
  }
});

const validateCredentials = (input: any) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(input);
};

export default loginRouter;
