import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone_number: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      default: "",
    },

    password_hash: {
      type: String,
      required: true,
    },

    telegram_id: {
      type: String,
      default: null,
    },

    telegram_username: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } 
);

const USER = mongoose.model("user", userSchema);
export default USER;
