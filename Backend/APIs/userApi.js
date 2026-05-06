import exp from "express"
import mongoose from "mongoose"
import {userModel} from "../Models/userModel.js"
export const userApp = exp.Router()
import { verifyToken } from "../Middleware/verifyToken.js";
import bcrypt from "bcryptjs";
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

//update user profile
userApp.put("/users",
  verifyToken("USER","ADMIN"),
  async (req, res) => {
    try {
      const updates = {};

      if (req.body.name)
         updates.name = req.body.name;
      if (req.body.email) 
        updates.email = req.body.email;
      if (req.body.profilePic) 
        updates.profilePic = req.body.profilePic;

      const user = await userModel.findByIdAndUpdate(
        req.user.id,
        updates,
        {
          new: true,
          runValidators: true
        }
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      res.status(200).json({
        message: "User updated successfully",
        payload: user
      });

    } catch (err) {
      res.status(500).json({
        message: "Error occurred",
        error: err.message
      });
    }
  }
);

//change password router
userApp.put("/users/password",
  verifyToken("USER","ADMIN"),
  async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;

      const user = await userModel.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Old password is incorrect"
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;

      await user.save();

      res.status(200).json({
        message: "Password updated successfully"
      });

    } catch (err) {
      res.status(500).json({
        message: "Error occurred",
        error: err.message
      });
    }
  }
);

//Displaying profile data 


