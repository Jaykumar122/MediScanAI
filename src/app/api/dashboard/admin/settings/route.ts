"use server";

import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/crypto";
import clientPromise from "@/dbConfig/dbConfig";

async function getDb() {
  const client = await clientPromise;
  return client.db("securerx");
}

async function getAuthUser(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) throw new Error("Unauthorized");
  const token = authHeader.split(" ")[1];
  const payload = await decrypt(token);
  if (!payload?.userId) throw new Error("Invalid token");
  return payload as { userId: string; email: string; role: string };
}

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (authUser.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden: Admin access required" },
        { status: 403 },
      );
    }

    const db = await getDb();
    const settingsCol = db.collection("settings");

    const settings: Record<string, unknown> = (await settingsCol.findOne({
      type: "system",
    })) || {
      type: "system",
      maxPrescriptionScans: 5,
      allowSelfRegistration: true,
      requireEmailVerification: false,
      maintenanceMode: false,
      allowedOAuthProviders: ["google", "github", "apple"],
      defaultUserRole: "patient",
      sessionTimeout: 172800, // 2 days in seconds
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json({
      message: "Settings fetched successfully",
      data: settings,
    });
  } catch (error) {
    const err = error as Error;
    if (err.message === "Unauthorized" || err.message === "Invalid token") {
      return NextResponse.json({ message: err.message }, { status: 401 });
    }
    console.error("Admin settings GET error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (authUser.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden: Admin access required" },
        { status: 403 },
      );
    }

    const updates: Record<string, unknown> = await req.json();

    const db = await getDb();
    const settingsCol = db.collection("settings");

    await settingsCol.updateOne(
      { type: "system" },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
          updatedBy: authUser.userId,
        },
      },
      { upsert: true },
    );

    const updatedSettings = await settingsCol.findOne({ type: "system" });

    return NextResponse.json({
      message: "Settings updated successfully",
      data: updatedSettings,
    });
  } catch (error) {
    const err = error as Error;
    if (err.message === "Unauthorized" || err.message === "Invalid token") {
      return NextResponse.json({ message: err.message }, { status: 401 });
    }
    console.error("Admin settings PATCH error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 },
    );
  }
}
