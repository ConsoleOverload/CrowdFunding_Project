import {Schema, model , Types} from "mongoose";

const donationSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  campaignId: {
    type: Types.ObjectId,
    ref: "Campaign",
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: [true,"Enter an amount"]
  },
  currency: {
    type: String,
    default: "INR"
  },

  payment: {
    provider: { type: String, default: "razorpay" },
    orderId: String,
    paymentId: String,
    signature: String
  },

  status: {
    type: String,
    enum: ["pending", "success", "failed", "refunded"],
    default: "pending"
  },

  isAnonymous: {
    type: Boolean,
    default: false
  }

}, { timestamps: true , versionKey:false , strict: "throw" });

export const Donation =  model("Donation", donationSchema);