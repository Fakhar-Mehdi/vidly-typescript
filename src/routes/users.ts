import express, { Request, Response } from "express";
import User from "../models/users";
import { pick } from "lodash";
import bcrypt from "bcrypt";
import authenticateUser from "../middleware/authenticateUser";
import { asyncMiddlewareFunction } from "../middleware/asyncMiddlewareFunction";
import { throwException } from "../helper";

const usersRouter = express.Router();

usersRouter.get(
  "/me",
  authenticateUser,
  asyncMiddlewareFunction(async (req: any, res: Response) => {
    if (!req.user) throwException(res);
    const user = await User.findById(req.user._id).select("-password -__v");
    if (!user) throwException(res);
    res.send(`\nThis is your information: ${JSON.stringify(user)}`);
  })
);

usersRouter.post(
  "/",
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    const { name, email, password, isAdmin } = req.body;
    if (!name || !email || !password)
      throwException(
        res,
        "Please provide Name, Email and Password and try again",
        400
      );
    let user: any = await User.findOne({ email });
    if (user) throwException(res, "User Already Created", 405);
    user = new User({
      name,
      email,
      password,
      isAdmin,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    res.send(
      `User Created Successfully\n${JSON.stringify(
        pick(user, ["_id", "name", "email"])
      )}`
    );
  })
);

export default usersRouter;
