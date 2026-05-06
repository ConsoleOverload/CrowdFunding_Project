import exp from "express";
import { verifyToken } from "../Middleware/verifyToken.js";
import { Donation } from "../Models/donationDetailsModel.js";
import { Campaign } from "../Models/campaignModel.js";
import { userModel } from "../Models/userModel.js";

const donationApp = exp.Router();


// MAKE DONATION
donationApp.post(
  "/donate/:campaignId",
  verifyToken("USER", "ADMIN"),
  async (req, res) => {

    try {

      const { amount, isAnonymous } = req.body;

      // validate amount
      if (!amount || amount <= 0) {
        return res.status(400).json({
          message: "Invalid donation amount"
        });
      }

      // find campaign
      const campaign = await Campaign.findById(
        req.params.campaignId
      );

      if (!campaign) {
        return res.status(404).json({
          message: "Campaign not found"
        });
      }

      // only approved campaigns can receive donations
      if (campaign.status !== "approved") {
        return res.status(400).json({
          message: "Campaign not approved for donations"
        });
      }

      // check if goal already reached
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

      // create donation
      const donation = new Donation({

        userId: req.user.id,

        campaignId: campaign._id,

        amount,

        isAnonymous: isAnonymous || false,

        status: "success"

      });

      await donation.save();

      // update campaign stats
      campaign.raisedAmount += amount;

      campaign.stats.donorCount += 1;

      // mark campaign completed if goal reached
      if (campaign.raisedAmount === campaign.goalAmount) {

        campaign.status = "completed";

      }

      await campaign.save();

      // update user stats
      await userModel.findByIdAndUpdate(
        req.user.id,
        {
          $inc: {
            numberOfDonations: 1,
            totalAmountDonated: amount
          }
        }
      );

      res.status(201).json({
        message: "Donation successful",
        payload: donation
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
});


// GET DONATIONS OF A CAMPAIGN
donationApp.get(
  "/campaign/:campaignId",
  async (req, res) => {

    try {

      const donations = await Donation.find({
        campaignId: req.params.campaignId
      })
      .populate("userId", "name");

      res.status(200).json(donations);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
});


// GET CURRENT USER DONATIONS
donationApp.get(
  "/my-donations",
  verifyToken("USER", "ADMIN"),
  async (req, res) => {

    try {

      const donations = await Donation.find({
        userId: req.user.id
      })
      .populate("campaignId", "title");

      res.status(200).json(donations);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
});

export default donationApp;