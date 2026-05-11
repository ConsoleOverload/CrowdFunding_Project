import exp from "express"
import mongoose from "mongoose"
import {userModel} from "../Models/userModel.js"
export const userApp = exp.Router()
import { verifyToken } from "../Middleware/verifyToken.js";
import bcrypt from "bcryptjs";
import { upload } from "../Middleware/upload.js";
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
//route for profile image
userApp.put(
  "/profile-image",

  verifyToken("USER", "ADMIN"),

  upload.single("image"),

  async (req, res) => {

    try {

      const user =
        await userModel.findByIdAndUpdate(

          req.user.id,

          {
            profileImageURL: req.file.path
          },

          {
            new: true
          }

        ).select("-password");

      res.status(200).json({

        message: "Profile image updated",

        payload: user

      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
});

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
      if (req.body.profileImageURL) 
        updates.profileImageURL = req.body.profileImageURL;

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


//Displaying profile data 


