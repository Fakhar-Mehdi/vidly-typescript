import express, { Request, Response } from "express";
import Rental from "../models/rentals";
import { isEmpty } from "lodash";
import Movie from "../models/movies";
import Customer from "../models/customers";

const rentalsRouter = express.Router();

rentalsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const rentals = Rental.find();
    res.send(isEmpty(rentals) ? "No Rentals Found" : rentals);
  } catch (e: any) {
    console.log(`No Rentals Found.\nFollowing Error Occurred: ${e.message}`);
  }
});

rentalsRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { movieId, customerId } = req.body;
    if (!movieId) throw new Error("movieId not Found");
    if (!customerId) throw new Error("customerId not Found");
    const movie: any = await Movie.findById(movieId);
    const customer: any = await Customer.findById(customerId);
    if (!movie || !customer) throw new Error("Invalid movieId or customerId");
    if (movie.numberInStock < 1)
      throw new Error("SORRY!!! This movie is out of stock at the moment");
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
    if (!result) throw new Error("Unable to save the new Rental");
    res.send(
      `Successfully added a new Rental.\nREMEMBER YOUR RENTALS's _ID\n${result}`
    );
  } catch (e: any) {
    console.log(`ERROR: ${e.message}`);
    res.send(`ERROR: ${e.message}`);
  }
});

rentalsRouter.post("/:_id", async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    if (!_id) throw new Error("id not found");
    const rental: any = await Rental.findById(_id);

    if (!rental) throw new Error("Rental not found against the provided id");
    if (rental.dateReturned || rental.rentalFee)
      throw new Error("This book is already returned");
    const fee = Math.floor(
      (rental.movie.dailyRentalRate *
        (86400000 +
          86400000 +
          86400000 +
          86400000 +
          rental.dateOut.getTime() -
          Date.now())) /
        86400000
    );

    const movie: any = await Movie.findById(rental.movie._id);
    movie.numberInStock++;
    await movie.save();

    const result = await Rental.findByIdAndUpdate(_id, {
      dateReturned: Date.now(),
      rentalFee: fee,
    });
    if (!result) throw new Error("Unable to update the info. Try Again");
    res.send(
      `Data Updated. Thank you for returning. Your Fee is: ${fee}\n\n${result}`
    );
  } catch (e: any) {
    console.log(`ERROR: ${e.message}`);
    res.send(`ERROR: ${e.message}`);
  }
});

export default rentalsRouter;
