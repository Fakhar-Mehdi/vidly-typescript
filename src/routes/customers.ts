import express from "express";
import Customer from "../models/customers";
import { Request, Response } from "express";
import { isEmpty } from "lodash";
import authenticateUser from "../middleware/authenticateUser";
import authenticateAdmin from "../middleware/authenticateAdmin";

const customersRouter = express.Router();

customersRouter.get("/", async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find();
    return !isEmpty(customers)
      ? res.send(customers)
      : res.status(404).send("No Customers Found");
  } catch (e: any) {
    console.log(`No Customers Found.\nFollowing Error Occurred: ${e.message}`);
    res.send(`No Customers Found.\nFollowing Error Occurred: ${e.message}`);
  }
});

customersRouter.get("/:_id", async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    if (!_id) throw new Error("id not Found");
    const customer = await Customer.find({ _id });
    if (!customer) throw new Error("customer not Found");
    res.send(customer);
  } catch (e: any) {
    console.log(`Id not Found\nFollowing error occurred: ${e.message}`);
    res.send(`Id not Found\nFollowing error occurred: ${e.message}`);
  }
});

customersRouter.post(
  "/",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const { isGold, name, phone } = req.body;
      const newCustomer = await new Customer({
        isGold: isGold || false,
        name,
        phone,
      });
      const result = await newCustomer.save();
      console.log(`${result}\nis now successfully added`);
      res.send(`${result}\nis now successfully added`);
    } catch (e: any) {
      console.log(
        `Unable to add the customer.\nFollowing error occurred${e.message}`
      );
      res.send(
        `Unable to add the customer.\nFollowing error occurred${e.message}`
      );
    }
  }
);

customersRouter.put(
  "/",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const { _id, name, isGold, phone } = req.body;
      if (!_id) throw new Error("id not Found");
      const result = await Customer.findByIdAndUpdate(
        { _id },
        { name, isGold, phone }
      );
      res.send(`${result} is now successfully updated with provided values.`);
    } catch (e: any) {
      console.log(
        `Unable to update the customer.\nFollowing Error Occurred: ${e.message}`
      );
      res.send(
        `Unable to update the customer.\nFollowing Error Occurred: ${e.message}`
      );
    }
  }
);

customersRouter.put(
  "/:_id",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const { _id } = req.params;
      if (!_id) throw new Error("id not Found");

      const { name, isGold, phone } = req.body;
      const result = await Customer.findByIdAndUpdate(
        { _id },
        { name, isGold, phone }
      );
      res.send(`${result} is now successfully updated with provided values.`);
    } catch (e: any) {
      console.log(
        `Unable to update the customer.\nFollowing Error Occurred: ${e.message}`
      );
      res.send(
        `Unable to update the customer.\nFollowing Error Occurred: ${e.message}`
      );
    }
  }
);

customersRouter.delete(
  "/",
  [authenticateUser, authenticateAdmin],
  async (req: Request, res: Response) => {
    try {
      const { _id } = req.body;
      if (!_id) throw new Error("id not Found");
      const result = await Customer.findByIdAndDelete({ _id });
      res.send(`${result} is now successfully deleted`);
    } catch (e: any) {
      console.log(`Id not Found\nFollowing error occurred: ${e.message}`);
      res.send(`Id not Found\nFollowing error occurred: ${e.message}`);
    }
  }
);

customersRouter.delete(
  "/:_id",
  [authenticateUser, authenticateAdmin],
  async (req: Request, res: Response) => {
    try {
      const { _id } = req.params;
      if (!_id) throw new Error("id not Found");
      const result = await Customer.findByIdAndDelete({ _id });
      res.send(`${result} is now successfully deleted`);
    } catch (e: any) {
      console.log(`Id not Found\nFollowing error occurred: ${e.message}`);
      res.send(`Id not Found\nFollowing error occurred: ${e.message}`);
    }
  }
);

export default customersRouter;
