// List all admin users
// ==========================================
import mongoose from "mongoose";
import User from "../models/usermodels";
import { connect } from "../dbConfig/dbConfig";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function listAdmins() {
  try {
    await connect();
    console.log("📦 Connected to database\n");

    const admins = await User.find({ role: "admin" }).select(
      "firstName lastName email mobileNumber isVerified createdAt"
    );

    if (admins.length === 0) {
      console.log("⚠️  No admin users found");
      process.exit(0);
    }

    console.log(`✅ Found ${admins.length} admin user(s):\n`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    admins.forEach((admin, index) => {
      console.log(`\n${index + 1}. ${admin.firstName} ${admin.lastName}`);
      console.log(`   📧 Email: ${admin.email}`);
      console.log(`   📱 Mobile: ${admin.mobileNumber}`);
      console.log(`   ✓ Verified: ${admin.isVerified ? "Yes" : "No"}`);
      console.log(`   📅 Created: ${admin.createdAt.toLocaleDateString()}`);
    });
    
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  } catch (error: any) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

listAdmins();
