import exp from "express";
import { Campaign } from "../Models/campaignModel.js";
import { verifyToken } from "../Middleware/verifyToken.js";

export const adminApp = exp.Router();

// GET all pending campaigns
adminApp.get("/campaigns/pending", verifyToken("ADMIN"), async (req, res) => {
  const campaigns = await Campaign.find({ status: "pending" });
  res.json(campaigns);
});

// APPROVE campaign
adminApp.put("/campaigns/approve/:id", verifyToken("ADMIN"), async (req, res) => {
  const campaign = await Campaign.findByIdAndUpdate(
    req.params.id,
    { 
        status: "approved",
        "verification.isVerified": true
     },
    { new: true }
  );

  res.json({ message: "Approved", campaign });
});

// REJECT campaign
adminApp.put("/campaigns/reject/:id", verifyToken("ADMIN"), async (req, res) => {
  const campaign = await Campaign.findByIdAndUpdate(
    req.params.id,
    { 
        status: "rejected",
        "verification.isVerified": false       
    },
    { new: true }
  );

  res.json({ message: "Rejected", campaign });
});