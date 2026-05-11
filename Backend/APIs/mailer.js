// mailer.js

import nodemailer from "nodemailer";


// CREATE TRANSPORTER
export const transporter = nodemailer.createTransport({

  service: "gmail",

  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }

});


// VERIFY CONNECTION
transporter.verify((error, success) => {

  if (error) {

    console.log("MAIL ERROR:", error);

  } else {

    console.log("Mailer is ready");

  }

});


// SEND DONATION EMAIL
export const sendDonationEmail = async (
  email,
  amount
) => {

  try {

    const info = await transporter.sendMail({

      from: `"CrowdFunding Donations" <${process.env.EMAIL}>`,

      to: email,

      subject: "Donation Successful 🎉",

      html: `
        <div style="font-family: Arial; padding: 20px;">
          
          <h2 style="color: #2e7d32;">
            Thank You For Your Donation 
          </h2>

          <p>
            Your donation of 
            <strong>₹${amount}</strong>
            was successfully received.
          </p>

          <p>
            Your contribution can genuinely
            make a difference.
          </p>

          <hr />

          <p style="font-size: 14px; color: gray;">
            Thank you for supporting us.
          </p>

        </div>
      `

    });

    console.log("MAIL SENT:", info.messageId);

  } catch (error) {

    console.log("EMAIL SEND ERROR:", error);

  }

};