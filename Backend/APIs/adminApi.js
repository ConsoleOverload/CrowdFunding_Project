import exp from "express";
import { Campaign } from "../Models/campaignModel.js";
import { verifyToken } from "../Middleware/verifyToken.js";

export const adminApp = exp.Router();


// ── GET ALL PENDING CAMPAIGNS ────────────────────────────────
adminApp.get("/campaigns/pending", verifyToken("ADMIN"), async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── GET ALL CAMPAIGNS (for admin stats dashboard) ────────────
// NEW ROUTE: used by Admin page to compute total/approved/rejected counts
adminApp.get("/campaigns/all", verifyToken("ADMIN"), async (req, res) => {
  try {
    const campaigns = await Campaign.find({
      status: { $ne: "deleted" },
    }).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── APPROVE CAMPAIGN ─────────────────────────────────────────
adminApp.put("/campaigns/approve/:id", verifyToken("ADMIN"), async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        "verification.isVerified": true,
      },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.json({ message: "Approved", campaign });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── REJECT CAMPAIGN ──────────────────────────────────────────
adminApp.put("/campaigns/reject/:id", verifyToken("ADMIN"), async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        "verification.isVerified": false,
      },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.json({ message: "Rejected", campaign });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
