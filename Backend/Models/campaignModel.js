import { Schema, model } from "mongoose";

const campaignSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique : true
    },
    description: {
      type: String,
      required: true
    },
    category: String,

    goalAmount: {
      type: Number,
      required: true
    },
    raisedAmount: {
      type: Number,
      default: 0
    },

    deadline: Date,
    location: String,

    media: {
      coverImage: String,
      gallery: [String]
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected", "completed","deleted"],
      default: "pending"
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    },

    stats: {
      donorCount: { type: Number, default: 0 },
      viewCount: { type: Number, default: 0 },
      shareCount: { type: Number, default: 0 }
    },

    verification: {
      isVerified: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

export const Campaign = model("Campaign", campaignSchema);