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


//Search for keywords route or all approved routes
campaignApp.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    let query = { status: "approved" };

    // 🔍 If search exists → filter by title
    if (search) {
      query.title = { $regex: search, $options: "i" }; // case-insensitive
    }

    const campaigns = await Campaign.find(query);

    res.status(200).json(campaigns);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// GET SINGLE CAMPAIGN

campaignApp.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign || campaign.status !== "approved") {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.status(200).json(campaign);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// UPDATE CAMPAIGN

campaignApp.put("/update/:id", async (req, res) => {
  try {
    // ✅ Allowed fields only
    const allowedUpdates = ["title", "description", "media", "deadline"];

    const updates = {};

    // filter only allowed fields
    for (let key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      updates,
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