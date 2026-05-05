import exp from "express"
import mongoose from "mongoose"
import {userModel} from "../Models/userModel.js"
export const userApp = exp.Router()
import { verifyToken } from "../Middleware/verifyToken.js";
userApp.get(
  "/users",
  verifyToken("USER", "ADMIN"),
  async (req, res) => {
    try {
      const user = await userModel
        .findById(req.user.id)
        .select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json({
        message: "User details",
        payload: user,
      });

    } catch (err) {
      res.status(500).json({
        message: "Error occurred",
        error: err.message,
      });
    }
  }
);

userApp.delete(
  "/users",
  verifyToken("USER", "ADMIN"),
  async (req, res) => {
    try {
      const user = await userModel.findByIdAndDelete(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json({
        message: "User deleted successfully",
        payload: user,
      });

    } catch (err) {
      res.status(500).json({
        message: "Error occurred",
        error: err.message,
      });
    }
  }
);

//Displaying profile data 


