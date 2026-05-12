import exp from "express";
import { userModel } from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "../Middleware/verifyToken.js";

const { sign } = jwt;

export const commonApp = exp.Router();


// ================= REGISTER =================
commonApp.post("/users", async (req, res) => {
  try {
    const allowedRoles = ["USER"];
    const newUser = req.body;
    console.log(newUser)
    // check role
    if (!allowedRoles.includes(newUser.role)) {
      return res.status(400).json({ message: "invalid role" });
    }

    // check existing user
    const existingUser = await userModel.findOne({ email: newUser.email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // hash password
    newUser.password = await bcrypt.hash(newUser.password, 12);

    const newUserDoc = new userModel(newUser);
    await newUserDoc.save();

    res.status(201).json({ message: "user created" });
  } catch (err) {
    res.status(500).json({
      message: "error occured",
      error: err.message,
    });
  }
});


// ================= LOGIN =================
commonApp.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "invalid email" });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(401).json({ message: "invalid password" }); // ✅ FIXED
    }

    const signedToken = sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", signedToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.status(200).json({
      message: "login success",
      payload: userWithoutPassword,
  });
  } catch (err) {
    res.status(500).json({
      message: "error occured",
      error: err.message,
    });
  }
});


// ================= LOGOUT =================
commonApp.get("/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({ message: "logout success" });
});


// ================= CHECK AUTH =================
commonApp.get(
  "/check-auth",
  verifyToken("USER", "ADMIN"), //  allow all roles
  async (req, res) => {
    try {
      res.status(200).json({
        message: "User authenticated",
        payload: req.user,
      });
    } catch (err) {
      res.status(500).json({
        message: "error occured",
        error: err.message,
      });
    }
  }
);


// ================= CHANGE PASSWORD =================
commonApp.put(
  "/password",
  verifyToken("USER", "ADMIN"),
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const userId = req.user.id;

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }

      // check current password
      const matched = await bcrypt.compare(currentPassword, user.password);
      if (!matched) {
        return res.status(401).json({ message: "current password incorrect" });
      }

      // check same password
      const samePassword = await bcrypt.compare(newPassword, user.password);
      if (samePassword) {
        return res.status(400).json({ message: "same password, try new one" });
      }

      // hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;

      await user.save();

      res.status(200).json({ message: "password updated successfully" });
    } catch (err) {
      res.status(500).json({
        message: "error occured",
        error: err.message,
      });
    }
  }
);


