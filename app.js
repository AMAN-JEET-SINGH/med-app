const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email provider
  auth: {
    user: "ajsing2121@gmail.com", // Replace with your email
    pass: "ngzt cjhf mnze khfa" // Use environment variables in production
  }
});

// API endpoint to send email
app.post("/send-email", async (req, res) => {
  const { mobile, time, details } = req.body;

  if (!mobile || !time || !details) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const mailOptions = {
    from: "ajsing2121@gmail.com", // Replace with your email
    to: "amanjeet1089singh@gmail.com", // Replace with the doctor's email
    subject: "Patient Contact Request",
    text: `Patient Mobile: ${mobile}\nTime: ${time}\nDetails: ${details}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
