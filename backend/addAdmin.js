import "dotenv/config"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import Admin from "./models/Admin.js"

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const hashedPassword = await bcrypt.hash(process.env.Admin_Password, 15); // your password here

    const newAdmin = new Admin({
      email: process.env.Admin_Email,
      password: hashedPassword
    });

    await newAdmin.save();
    console.log("✅ Admin inserted successfully");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("❌ Error inserting admin:", err);
    mongoose.disconnect();
  });
