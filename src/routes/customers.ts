import express from "express";
import Customer from "../models/customers";
import { Request, Response } from "express";
import authenticateUser from "../middleware/authenticateUser";
import authenticateAdmin from "../middleware/authenticateAdmin";
import { asyncMiddlewareFunction } from "../middleware/asyncMiddlewareFunction";
import {
  deleteObject,
  getAll,
  getById,
  throwException,
  updateCustomer,
} from "../helper";
import w from "winston";

const customersRouter = express.Router();

customersRouter.get(
  "/",
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    await getAll(res, Customer, "Customer");
  })
);

customersRouter.get(
  "/:_id",
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    await getById(req, res, Customer, "Customer");
  })
);

customersRouter.post(
  "/",
  authenticateUser,
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    const { isGold, name, phone } = req.body;
    const newCustomer = await new Customer({
      isGold: isGold || false,
      name,
      phone,
    });
    const result = await newCustomer.save();
    if (!result) throwException(res);
    w.info(`${result}\nis now successfully added`);
    res.send(`${result}\nis now successfully added`);
  }, "\nUnable to add the customer\n")
);

customersRouter.put(
  "/",
  authenticateUser,
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    await updateCustomer(req, res, false);
  }, "\nUnable to update the customer\n")
);

customersRouter.put(
  "/:_id",
  authenticateUser,
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    await updateCustomer(req, res, true);
  }, "\nUnable to update the customer.\n")
);

customersRouter.delete(
  "/",
  [authenticateUser, authenticateAdmin],
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    await deleteObject(req, res, true, Customer);
  })
);

customersRouter.delete(
  "/:_id",
  [authenticateUser, authenticateAdmin],
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    await deleteObject(req, res, false, Customer);
  })
);

export default customersRouter;
