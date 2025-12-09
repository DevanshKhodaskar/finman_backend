import mongoose from "mongoose";


const querySchema = new mongoose.Schema(
  {
    phone_number: {
      type: String,
      required: true,
      index: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    name: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "Other",
      enum: ["Food", "Transport", "Shopping", "Entertainment", "Bills", "Other"],
    },

    isIncome: {
      type: Boolean,
      default: false,
      required: true,
    },

    time: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const QUERY = mongoose.model("queries", querySchema);
export default QUERY;
