// mailer.js

import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

export const sendDonationEmail = async (email, amount) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Donation Successful 🎉",
    html: `<h2>Thanks ❤️</h2><p>You donated ₹${amount}</p>`
  });
};