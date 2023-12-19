import mongoose, { Document, Model } from "mongoose";

interface ICustomerDoc extends Document {
  isGold: boolean;
  name: string;
  phone: string;
}

interface ICustomerModel extends Model<ICustomerDoc> {}

const customerSchema = new mongoose.Schema({
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
    maxLength: 15 ,
    trim: true,
  },
});

const Customer: ICustomerModel = mongoose.model<ICustomerDoc, ICustomerModel>(
  "Customer",
  customerSchema
);

export default Customer;
