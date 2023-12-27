import express, { Request, Response } from "express";
import User from "../models/users";
import bcrypt from "bcrypt";
import { asyncMiddlewareFunction } from "../middleware/asyncMiddlewareFunction";
import { throwException, validateCredentials } from "../helper";

const loginRouter = express.Router();

loginRouter.post(
  "/",
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    const { error } = validateCredentials(req.body);
    if (error) throwException(res, "invalid Email or Pasword", 400);
    const { email, password } = req.body;
    const user: any = await User.findOne({ email });
    if (!user) throwException(res, "invalid Email or Pasword", 404);
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) throwException(res, "invalid Email or Pasword", 404);
    const token = user.getAuthenticationToken();
    res.header("x-auth-token", token).send(`Login Successful`);
  })
);

export default loginRouter;
