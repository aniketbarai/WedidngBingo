import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.set('trust proxy', true);

/* ================= NODEMAILER CONFIG ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

/* ================= EMAIL TEMPLATES (FIXED) ================= */

// HTML for the Client (Confirmation) - Using inline styles for max compatibility
const clientHTML = (name) => `
  <div style="background-color: #0a0a0a; padding: 40px 20px; text-align: center; font-family: 'Times New Roman', Times, serif;">
    <div style="max-width: 600px; margin: 0 auto; border: 1px solid #C6A75E; padding: 40px; background-color: #050505;">
      <h1 style="color: #C6A75E; font-weight: 100; letter-spacing: 4px; font-size: 28px; margin-bottom: 20px; text-transform: uppercase;">
        Hello, ${name}
      </h1>
      <p style="color: #cccccc; font-size: 16px; line-height: 1.8; margin-bottom: 30px; letter-spacing: 1px;">
        Your inquiry has been successfully received into our private archive. <br>
        We believe every story is a unique masterpiece.
      </p>
      <div style="margin: 30px 0;">
        <div style="display: inline-block; height: 1px; width: 40px; background-color: #C6A75E; vertical-align: middle;"></div>
        <span style="color: #C6A75E; font-size: 11px; letter-spacing: 5px; text-transform: uppercase; margin: 0 10px; font-family: sans-serif;">Authentic Memories</span>
        <div style="display: inline-block; height: 1px; width: 40px; background-color: #C6A75E; vertical-align: middle;"></div>
      </div>
      <p style="color: #666666; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-top: 30px;">
        Our team will contact you shortly to discuss your vision.
      </p>
    </div>
  </div>
`;

// HTML for You (Admin Notification)
const adminHTML = (name, email, date, message) => `
  <div style="font-family: sans-serif; padding: 20px; color: #333; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-top: 4px solid #C6A75E; padding: 30px; border-radius: 8px;">
      <h2 style="color: #111; border-bottom: 1px solid #eee; padding-bottom: 10px; font-size: 20px;">New Website Inquiry</h2>
      <p><strong>Client:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Event Date:</strong> ${date || "Not provided"}</p>
      <div style="background: #f4f4f4; padding: 20px; border-radius: 6px; margin-top: 20px;">
        <p style="margin-top: 0; color: #666; font-size: 12px; text-transform: uppercase; font-weight: bold;">Message:</p>
        <p style="margin-bottom: 0; line-height: 1.6;">${message}</p>
      </div>
    </div>
  </div>
`;

/* ================= DB CONNECTION ================= */
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/weddingDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ Connection Error:", err));

/* ================= MODELS ================= */
const imageSchema = new mongoose.Schema({
  src: String,
  clicks: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  likedBy: [String], 
});

const Image = mongoose.model("Image", imageSchema);

/* ================= ROUTES ================= */

app.post("/send-mail", async (req, res) => {
  const { name, email, date, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    // 1. Send to Admin (YOU)
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`, // Using your email as sender to avoid spam filters
      replyTo: email, // If you click "reply", it goes to the client
      to: process.env.EMAIL_USER,
      subject: `✨ New Inquiry: ${name}`,
      html: adminHTML(name, email, date, message),
    });

    // 2. Send to Client (CONFIRMATION)
    await transporter.sendMail({
      from: `"The Wedding Studio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Regarding your inquiry — ${name}`,
      html: clientHTML(name),
    });

    console.log("✅ Dual HTML Emails Transmitted");
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Mail Error:", error);
    res.status(500).json({ success: false, error: "Transmission failed." });
  }
});

/* [Rest of the Image Gallery Routes Remain the Same] */
app.get("/images", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const sortMode = req.query.sort || "newest"; 
    const skip = (page - 1) * limit;

    if (sortMode === "popular") {
      const images = await Image.aggregate([
        { $addFields: { score: { $add: [{ $multiply: ["$likes", 3] }, "$clicks"] } } },
        { $sort: { score: -1, _id: -1 } }, 
        { $skip: skip },
        { $limit: limit }
      ]);
      return res.json(images);
    }
    const images = await Image.find().sort({ _id: -1 }).skip(skip).limit(limit);
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

app.post("/click/:id", async (req, res) => {
  try {
    const updatedImage = await Image.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } }, { new: true });
    res.json({ success: true, clicks: updatedImage.clicks });
  } catch (err) { res.status(500).json({ success: false }); }
});

app.post("/like/:id", async (req, res) => {
  try {
    const userIp = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const image = await Image.findById(req.params.id);
    if (image.likedBy.includes(userIp)) return res.status(400).json({ success: false, message: "Already liked" });
    const updated = await Image.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 }, $addToSet: { likedBy: userIp } }, { new: true });
    res.json({ success: true, newLikes: updated.likes });
  } catch (err) { res.status(500).json({ success: false }); }
});

app.get("/seed", async (req, res) => {
  await Image.deleteMany();
  const dummyData = Array.from({ length: 48 }, (_, i) => ({
    src: `https://picsum.photos/seed/${i + 200}/400/500`,
    likes: Math.floor(Math.random() * 10),
    clicks: Math.floor(Math.random() * 50),
    likedBy: []
  }));
  await Image.insertMany(dummyData);
  res.send("Seeded! 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export the Express app for Vercel serverless functions
export default app;