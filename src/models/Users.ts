import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      // unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// or statement below says if already have the model then return the user and if you don't have then it will create a new model
const User = models.User || mongoose.model("User", userSchema);

export default User;
