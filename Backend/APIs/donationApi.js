import exp from "express";
import { userModel } from "../Models/userModel.js";
import { Donation } from "../Models/donationDetailsModel.js"
import { verifyToken } from "../Middleware/verifyToken.js";
export const donationApp = exp.Router();

// Route to donate
// route to get all donations list for a campign
// route to all donations of user 
// route for all time donations
