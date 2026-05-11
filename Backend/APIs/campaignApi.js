import exp from "express";
import { verifyToken } from "../Middleware/verifyToken.js";
import { Campaign } from "../Models/campaignModel.js";
import { upload } from "../Middleware/upload.js";
const campaignApp = exp.Router();


// CREATE CAMPAIGN

campaignApp.post("/create",
  verifyToken("USER", "ADMIN"),
  async (req, res) => {

    try {
      const coverImage = req.files?.coverImage?.[0]?.path || "";

      const gallery =
        req.files?.gallery?.map(
          file => file.path
        ) || [];
      const newCampaign = new Campaign({
        ...req.body,
        createdBy: req.user.id,
        raisedAmount: 0,
        status: "pending",
        media:{
          coverImage,
          gallery
        }
      });

      await newCampaign.save();

      res.status(201).json({
        message: "Campaign created successfully",
        data: newCampaign
      });

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
});


// GET ALL APPROVED CAMPAIGNS + SEARCH

campaignApp.get("/", async (req, res) => {
  try {

    const { search } = req.query;

    // base query
    let query = {
      status: "approved"
    };

    // search by title OR description
    if (search && search.trim() !== "") {

      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i"
          }
        },
        {
          description: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    const campaigns = await Campaign.find(query);

    res.status(200).json(campaigns);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});





// UPDATE CAMPAIGN

campaignApp.put("/update/:id",
  verifyToken("USER", "ADMIN"),
  async (req, res) => {
    try {

      const campaign = await Campaign.findById(req.params.id);

      if (!campaign) {
        return res.status(404).json({
          message: "Campaign not found"
        });
      }

      // owner/admin check
      if (
        campaign.createdBy.toString() !== req.user.id &&
        req.user.role !== "ADMIN"
      ) {
        return res.status(403).json({
          message: "Not authorized"
        });
      }

      const allowedUpdates = [
        "title",
        "description",
        "media",
        "deadline"
      ];

      const updates = {};

      for (let key of allowedUpdates) {
        if (req.body[key] !== undefined) {
          updates[key] = req.body[key];
        }
      }

      const updatedCampaign =
        await Campaign.findByIdAndUpdate(
          req.params.id,
          updates,
          { new: true }
        );

      res.status(200).json({
        message: "Campaign updated successfully",
        data: updatedCampaign
      });

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
});

// DELETE (Soft Delete) CAMPAIGN
campaignApp.patch("/delete/:id",
  verifyToken("USER", "ADMIN"), // only USER or ADMIN can hit this route
  async (req, res) => {
    try {
      const campaign = await Campaign.findById(req.params.id);

      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      // CHECKING THE ROLE IS IT THE ADMIN OR THE USER WHO CREATED
      if (
        campaign.createdBy.toString() !== req.user.id &&
        req.user.role !== "ADMIN"
      ) {
        return res.status(403).json({ message: "Not authorized to delete this campaign" });
      }

      // Soft delete by marking status
      await Campaign.findByIdAndUpdate(
        req.params.id,
        { status: "deleted",
        "verification.isVerified": false
         },
        { new: true }
      );

      res.status(200).json({ message: "Campaign deleted successfully" });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// RESTORE CAMPAIGN
campaignApp.put("/restore/:id",
  verifyToken("USER", "ADMIN"),
  async (req, res) => {
    try {
      const campaign = await Campaign.findById(req.params.id);

      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      // Only allow restore if currently deleted
      if (campaign.status !== "deleted") {
        return res.status(400).json({ message: "Campaign is not deleted" });
      }

      let updates = {};

      if (campaign.createdBy.toString() === req.user.id) {
        // if Creator restores remains as not verified
        updates = {
          status: "pending",
          "verification.isVerified": false
        };
      } else if (req.user.role === "ADMIN") {
        //if Admin restored → verified
        updates = {
          status: "approved",
          "verification.isVerified": true
        };
      } else {
        return res.status(403).json({ message: "Not authorized to restore this campaign" });
      }

      const restoredCampaign = await Campaign.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true }
      );

      res.status(200).json({
        message: "Campaign restored successfully",
        data: restoredCampaign
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});




// GET SINGLE CAMPAIGN

campaignApp.get("/:id", async (req, res) => {

  try {

    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found"
      });
    }

    // only approved campaigns visible publicly
    if (campaign.status !== "approved") {
      return res.status(403).json({
        message: "Campaign not approved yet"
      });
    }

    res.status(200).json(campaign);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
export default campaignApp;