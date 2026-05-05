import exp from "express";
import { verifyToken } from "../Middleware/verifyToken.js";
import { Campaign } from "../Models/campaignModel.js";
const campaignApp = exp.Router();


// CREATE CAMPAIGN

campaignApp.post("/create", async (req, res) => {
  try {
    const newCampaign = new Campaign({
      ...req.body,           // take all fields from request
      raisedAmount: 0,       // default value
      status: "pending"      // default status
    });

    await newCampaign.save();

    res.status(201).json({
      message: "Campaign created successfully",
      data: newCampaign
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL CAMPAIGNS (only approved)

campaignApp.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: "approved" });

    res.status(200).json(campaigns);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE CAMPAIGN

campaignApp.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.status(200).json(campaign);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// APPROVE CAMPAIGN (ADMIN)

campaignApp.put("/approve/:id", verifyToken("ADMIN"), async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    campaign.status = "approved";
    await campaign.save();

    res.status(200).json({
      message: "Campaign approved",
      campaign
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// REJECT CAMPAIGN
campaignApp.put("/reject/:id", verifyToken("ADMIN"), async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    campaign.status = "rejected";
    await campaign.save();

    res.status(200).json({
      message: "Campaign rejected",
      campaign
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE CAMPAIGN

campaignApp.put("/update/:id", async (req, res) => {
  try {
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.status(200).json({
      message: "Campaign updated successfully",
      data: updatedCampaign
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET PENDING CAMPAIGNS 
campaignApp.get("/pending", verifyToken("ADMIN"), async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: "pending" });

    res.status(200).json(campaigns);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE CAMPAIGN

campaignApp.delete("/delete/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.status(200).json({
      message: "Campaign deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default campaignApp;