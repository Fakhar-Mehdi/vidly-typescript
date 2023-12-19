import mongoose, { Document, Model } from "mongoose";

interface IRentalDoc extends Document {
  movie: {
    name: string;
    dailyRentalRate: number;
  };
  customer: {
    name: string;
    isGold: boolean;
    phone: string;
  };
}

interface IRentalModel extends Model<IRentalDoc> {}

const rentalSchema = new mongoose.Schema({
  movie: {
    required: true,
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 25,
        trim: true,
      },
      dailyRentalRate: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
    }),
  },
  customer: {
    required: true,
    type: new mongoose.Schema({
      isGold: {
        type: Boolean,
        required: true,
        default: false,
      },
      name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 15,
        trim: true,
      },
    }),
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

const Rental: IRentalModel = mongoose.model<IRentalDoc, IRentalModel>(
  "Rentals",
  rentalSchema
);

export default Rental;
