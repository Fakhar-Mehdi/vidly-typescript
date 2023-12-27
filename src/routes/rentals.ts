import express, { Request, Response } from "express";
import Rental from "../models/rentals";
import { isEmpty } from "lodash";
import Movie from "../models/movies";
import Customer from "../models/customers";
import authenticateUser from "../middleware/authenticateUser";
import { asyncMiddlewareFunction } from "../middleware/asyncMiddlewareFunction";
import { getAll, throwException } from "../helper";

const rentalsRouter = express.Router();

rentalsRouter.get(
  "/",
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    await getAll(res, Rental, "Rental");
  })
);

rentalsRouter.post(
  "/",
  authenticateUser,
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    const { movieId, customerId } = req.body;
    if (!movieId) throwException(res, "movieId not Found", 400);

    if (!customerId) throwException(res, "customerId not Found", 400);
    const movie: any = await Movie.findById(movieId);
    const customer: any = await Customer.findById(customerId);
    if (!movie || !customer)
      throwException(res, "Invalid movieId or customerId", 404);
    if (movie.numberInStock < 1)
      throwException(
        res,
        "SORRY!!! This movie is out of stock at the moment",
        405
      );
    movie.numberInStock--;
    await movie.save();
    const newRental = new Rental({
      movie: {
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
        _id: movie._id,
      },
      customer: {
        isGold: customer.isGold,
        name: customer.name,
        phone: customer.phone,
        _id: customer._id,
      },
    });
    const result = await newRental.save();
    if (!result) throwException(res);
    res.send(
      `Successfully added a new Rental.\nREMEMBER YOUR RENTALS's _ID\n${result}`
    );
  })
);

rentalsRouter.post(
  "/:_id",
  authenticateUser,
  asyncMiddlewareFunction(async (req: Request, res: Response) => {
    const { _id } = req.params;
    if (!_id) throwException(res, "Id not Found", 400);
    const rental: any = await Rental.findById(_id);

    if (!rental) throwException(res, "Rental not Found", 400);
    if (rental.dateReturned || rental.rentalFee)
      throwException(res, "This book is already returned", 400);
    const fee = Math.floor(
      (rental.movie.dailyRentalRate * (rental.dateOut.getTime() - Date.now())) /
        86400000
    );

    const movie: any = await Movie.findById(rental.movie._id);
    movie.numberInStock++;
    await movie.save();

    const result = await Rental.findByIdAndUpdate(_id, {
      dateReturned: Date.now(),
      rentalFee: fee,
    });
    if (!result) throwException(res);
    res.send(
      `Data Updated. Thank you for returning. Your Fee is: ${fee}\n\n${result}`
    );
  })
);

export default rentalsRouter;
