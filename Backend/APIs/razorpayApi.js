import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

import { Donation } from "../Models/donationDetailsModel.js";
import { Campaign } from "../Models/campaignModel.js";
import { userModel } from "../Models/userModel.js";

import { verifyToken } from "../Middleware/verifyToken.js";
import { sendDonationEmail } from "./mailer.js";

export const razorpayApp = express.Router();


// RAZORPAY INSTANCE
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});


// ================= CREATE ORDER =================

razorpayApp.post(
  "/create-order",
  verifyToken("USER", "ADMIN"),
  async (req, res) => {

    try {

      const { amount, campaignId } = req.body;

      // validate amount
      if (!amount || amount <= 0) {
        return res.status(400).json({
          message: "Invalid donation amount"
        });
      }

      // find campaign
      const campaign = await Campaign.findById(
        campaignId
      );

      if (!campaign) {
        return res.status(404).json({
          message: "Campaign not found"
        });
      }

      // only approved campaigns
      if (campaign.status !== "approved") {
        return res.status(400).json({
          message: "Campaign not accepting donations"
        });
      }

      // goal already reached
      if (campaign.raisedAmount >= campaign.goalAmount) {

        return res.status(400).json({
          message: "Funding goal already reached"
        });

      }

      // calculate remaining amount
      const remainingAmount =
        campaign.goalAmount - campaign.raisedAmount;

      // prevent overfunding
      if (amount > remainingAmount) {

        return res.status(400).json({
          message: `Remaining amount is ₹${remainingAmount}. Please donate ₹${remainingAmount} or less.`
        });

      }

      // create razorpay order
      const order =
        await razorpayInstance.orders.create({

          amount: amount * 100,

          currency: "INR",

          receipt: `receipt_${Date.now()}`

      });

      // save pending donation
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

        message: "Order created successfully",

        order,

        donationId: donation._id

      });

    } catch (err) {

      console.log("CREATE ORDER ERROR:", err);

      res.status(500).json({

        message: "Error creating order",

        error: err.message

      });

    }
});


// ================= VERIFY PAYMENT =================

razorpayApp.post(
  "/verify-payment",
  verifyToken("USER", "ADMIN"),
  async (req, res) => {

    try {

      const {

        razorpay_order_id,

        razorpay_payment_id,

        razorpay_signature,

        donationId

      } = req.body;

      // create signature body
      const body =
        razorpay_order_id +
        "|" +
        razorpay_payment_id;

      // generate expected signature
      const expectedSignature = crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_SECRET
        )
        .update(body)
        .digest("hex");

      // verify payment
      if (expectedSignature !== razorpay_signature) {

        return res.status(400).json({
          message: "Invalid payment signature"
        });

      }

      // find donation
      const donation =
        await Donation.findById(donationId);

      if (!donation) {

        return res.status(404).json({
          message: "Donation not found"
        });

      }

      // prevent duplicate processing
      if (donation.status === "success") {

        return res.status(400).json({
          message: "Payment already processed"
        });

      }

      // update donation
      donation.payment.paymentId =
        razorpay_payment_id;

      donation.payment.signature =
        razorpay_signature;

      donation.status = "success";

      await donation.save();

      // update campaign
      const campaign =
        await Campaign.findById(
          donation.campaignId
        );

      if (!campaign) {

        return res.status(404).json({
          message: "Campaign not found"
        });

      }

      campaign.raisedAmount += donation.amount;

      campaign.stats.donorCount += 1;

      // mark campaign completed
      if (
        campaign.raisedAmount ===
        campaign.goalAmount
      ) {

        campaign.status = "completed";

      }

      await campaign.save();

      // update user stats
      await userModel.findByIdAndUpdate(
        donation.userId,
        {
          $inc: {

            numberOfDonations: 1,

            totalAmountDonated:
              donation.amount

          }
        }
      );

      // send confirmation email
      const user =
        await userModel.findById(
          donation.userId
        );

      if (user?.email) {

        await sendDonationEmail(
          user.email,
          donation.amount
        );

      }

      res.status(200).json({

        message: "Payment verified successfully",

        payload: donation

      });

    } catch (err) {

      console.log("VERIFY PAYMENT ERROR:", err);

      res.status(500).json({

        message: "Payment verification failed",

        error: err.message

      });

    }
});

export default razorpayApp;