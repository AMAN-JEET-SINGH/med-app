require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let doctors = [
  { id: 1, name: "Dr. Aman", email: "amanjeet1089singh@gmail.com", specialty: "Cardiologist" },
  { id: 2, name: "Dr. Amanjeet", email: "amanjeet157singh@gmail.com", specialty: "Neurologist" },
  { id: 3, name: "Dr. Kabir", email: "amanxkabir@gmail.com", specialty: "Orthopedic Surgeon" },
  { id: 4, name: "Dr. Skit", email: "amanjeetsingh.skit@gmail.com", specialty: "Dermatologist" }
];

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Home - Select Doctor Page
app.get("/", (req, res) => {
  res.render("index", { doctors });
});

// Contact Doctor Page
app.get("/contact/:doctorId", (req, res) => {
  const doctorId = parseInt(req.params.doctorId);
  const selectedDoctor = doctors.find(doc => doc.id === doctorId);
  if (!selectedDoctor) return res.status(404).send("Doctor not found.");
  res.render("contact", { doctor: selectedDoctor });
});

// Send Email
app.post("/send-email", async (req, res) => {
  const { mobile, details, doctorId } = req.body;
  const time = new Date().toLocaleString();
  if (!mobile || !details || !doctorId) return res.status(400).json({ error: "All fields are required." });

  const selectedDoctor = doctors.find(doc => doc.id === parseInt(doctorId));
  if (!selectedDoctor) return res.status(400).json({ error: "Invalid doctor selected." });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: selectedDoctor.email,
    subject: "Patient Contact Request",
    text: `Doctor: ${selectedDoctor.name}\nSpecialty: ${selectedDoctor.specialty}\nPatient Mobile: ${mobile}\nTime: ${time}\nDetails: ${details}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.render("success", { message: `Email sent successfully to ${selectedDoctor.name}` });
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    res.render("error", { message: "Failed to send email. Please try again later." });
  }
});

// 🛠 Admin Page - View/Add/Delete Doctors
app.get("/admin", (req, res) => {
  res.render("admin", { doctors });
});

// Add Doctor
app.post("/admin/add", (req, res) => {
  const { name, email, specialty } = req.body;
  if (!name || !email || !specialty) {
    return res.render("error", { message: "All fields are required." });
  }

  const newDoctor = { id: doctors.length + 1, name, email, specialty };
  doctors.push(newDoctor);
  res.redirect("/admin");
});

// Delete Doctor
app.post("/admin/delete/:doctorId", (req, res) => {
  const doctorId = parseInt(req.params.doctorId);
  doctors = doctors.filter(doc => doc.id !== doctorId);
  res.redirect("/admin");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
