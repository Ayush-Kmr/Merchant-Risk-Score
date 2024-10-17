// utils/emailService.js
const nodemailer = require("nodemailer");
require("dotenv").config(); // Ensure this is at the top to load environment variables

// Configure your email transporter
const transporter = nodemailer.createTransport({
  //   service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "testhackathon260@gmail.com", // Your Gmail address
    pass: "onje dueo mxqf mwzx", // Your App Password
  },
});

// Sends an email alert to the merchant
async function sendEmail(merchant) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: merchant.userEmail,
    subject: "Merchant Key Leak Detected",
    text: `Dear ${merchant._id},\n\nYour merchant key was found leaked on GitHub. Please take immediate action!\n\nRegards,\nSecurity Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Alert email sent to ${merchant.userEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed"); // Rethrow the error for further handling
  }
}

module.exports = { sendEmail };
