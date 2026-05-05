import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"]
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      index: true
    },
    password: {
      type: String,
      required: [true, "Password is Required"]
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER"
    },
    profileImageURL: String,

    Country:{
      type:String,
      default:"INDIA"
    },

    isUserActive: {
      type: Boolean,
      default: true
    },

    numberOfDonations: {
      type: Number,
      default: 0
    },

    totalAmountDonated: {
      type: Number,
      default: 0
    }
  },
  { 
    timestamps: true,
    versionKey:false,
    strict:"throw"
   }
);

export const userModel = model("User", userSchema);
