import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

import { Donation } from "../Models/donationDetailsModel.js";
import { Campaign } from "../Models/campaignModel.js";
import { userModel } from "../Models/userModel.js";
import { verifyToken } from "../Middleware/VerifyToken.js";
import { sendDonationEmail } from "./mailer.js";

export const razorpayApp = express.Router();
console.log("KEY:", process.env.RAZORPAY_KEY_ID);
console.log("SECRET:", process.env.RAZORPAY_SECRET);

// 🔑 Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});


//  CREATE ORDER
razorpayApp.post("/create-order", verifyToken("USER"), async (req, res) => {
  try {
    console.log("KEY:", process.env.RAZORPAY_KEY_ID);
console.log("SECRET:", process.env.RAZORPAY_SECRET);
    const { amount, campaignId } = req.body;

    const order = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    //  Save pending donation
    const donation = await Donation.create({
      userId: req.user.id,
      campaignId,
      amount,
      payment: {
        orderId: order.id
      },
      status: "pending"
    });

    res.status(200).json({
      message: "Order created",
      order,
      donationId: donation._id
    });

  } catch (err) {
    res.status(500).json({
      message: "Error creating order",
      error: err.message
    });
  }
});


//  VERIFY PAYMENT
razorpayApp.post("/verify-payment", verifyToken("USER"), async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      donationId
    } = req.body;

    //  Step 1: Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

   // if (expectedSignature !== razorpay_signature) {
   //   return res.status(400).json({
    //    message: "Invalid payment"
    //  });
   // }

    //  Step 2: Get donation FIRST
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found"
      });
    }

    //  Step 3: Prevent duplicate
    if (donation.status === "success") {
      return res.json({
        message: "Already processed"
      });
    }

    //  Step 4: Update donation
    donation.payment.paymentId = razorpay_payment_id;
    donation.payment.signature = razorpay_signature;
    donation.status = "success";

    await donation.save();

    //  Step 5: Update Campaign
    await Campaign.findByIdAndUpdate(
      donation.campaignId,
      {
        $inc: {
          raisedAmount: donation.amount,
          "stats.donorCount": 1
        }
      }
    );

    //  Step 6: Update User
    await userModel.findByIdAndUpdate(
      donation.userId,
      {
        $inc: {
          numberOfDonations: 1,
          totalAmountDonated: donation.amount
        }
      }
    );

    //  Step 7: Send Email
    const user = await userModel.findById(donation.userId);
    await sendDonationEmail(user.email, donation.amount);

    res.status(200).json({
      message: "Payment successful"
    });

  } catch (err) {
    console.log("VERIFY ERROR:", err); // 👈 ADD THIS
    res.status(500).json({
      message: "Verification failed",
      error: err.message
    });
  }
});


