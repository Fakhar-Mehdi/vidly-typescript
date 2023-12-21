import express, { Request, Response } from "express";
import User from "../models/users";
import { pick } from "lodash";
import bcrypt from "bcrypt";
import authenticateUser from "../middleware/authenticateUser";

const usersRouter = express.Router();

usersRouter.get("/me", authenticateUser, async (req: any, res: Response) => {
  try {
    if (!req.user) {
      res.status(500);
      throw new Error("Internal Server Error");
    }
    const user = await User.findById(req.user._id).select("-password -__v");
    if (!user) throw new Error("Internal Server Error");
    res.send(`\nThis is your information: ${JSON.stringify(user)}`);
  } catch (e: any) {
    if (res.statusCode === 200) res.status(500);
    console.log(`ERROR: ${e.message}`);
    res.send(`ERROR: ${e.message}`);
  }
});

usersRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    if (!name || !email || !password)
      throw new Error("Please provide Name, Email and Password and try again");
    let user: any = await User.findOne({ email });
    if (user) throw new Error("User Already Created");
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
  } catch (e: any) {
    console.log(`ERROR: ${e.message}`);
    res.send(`ERROR: ${e.message}`);
  }
});

export default usersRouter;
