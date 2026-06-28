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

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");

    const db = await getDb();
    const usersCol = db.collection("users");
    const prescriptionsCol = db.collection("prescriptions");

    // Get recent user registrations
    const recentUsers = await usersCol
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray();

    // Get recent prescription activities
    const recentPrescriptions = await prescriptionsCol
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray();

    // Combine and sort by date
    const activities: Array<{
      type: string;
      timestamp: Date;
      data: Record<string, unknown>;
    }> = [];

    recentUsers.forEach((user) => {
      activities.push({
        type: "user_registered",
        timestamp: user.createdAt,
        data: {
          userId: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          provider: user.provider || "local",
        },
      });
    });

    recentPrescriptions.forEach((rx) => {
      activities.push({
        type: "prescription_created",
        timestamp: rx.createdAt,
        data: {
          prescriptionId: rx._id,
          patientName: rx.patientName,
          symptoms: rx.symptoms,
          medicationCount: rx.medications?.length || 0,
        },
      });
    });

    // Sort all activities by timestamp
    activities.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({
      message: "Activity log fetched successfully",
      data: activities.slice(0, limit),
      pagination: {
        limit,
        skip,
        total: activities.length,
      },
    });
  } catch (error) {
    const err = error as Error;
    if (err.message === "Unauthorized" || err.message === "Invalid token") {
      return NextResponse.json({ message: err.message }, { status: 401 });
    }
    console.error("Admin activity GET error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (authUser.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden: Admin access required" },
        { status: 403 },
      );
    }

    const { type, data } = await req.json();

    if (!type) {
      return NextResponse.json(
        { message: "Activity type is required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const activityCol = db.collection("activity_logs");

    const activity = {
      type,
      data,
      adminId: authUser.userId,
      adminEmail: authUser.email,
      timestamp: new Date(),
    };

    await activityCol.insertOne(activity);

    return NextResponse.json({
      message: "Activity logged successfully",
      data: activity,
    });
  } catch (error) {
    const err = error as Error;
    if (err.message === "Unauthorized" || err.message === "Invalid token") {
      return NextResponse.json({ message: err.message }, { status: 401 });
    }
    console.error("Admin activity POST error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 },
    );
  }
}
