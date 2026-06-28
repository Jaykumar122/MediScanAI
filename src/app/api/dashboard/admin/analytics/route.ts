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
    const usersCol = db.collection("users");
    const prescriptionsCol = db.collection("prescriptions");

    // Calculate user growth by month (last 6 months)
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

    const userGrowth = await usersCol
      .aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ])
      .toArray();

    // User distribution by role
    const usersByRole = await usersCol
      .aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    // User status distribution
    const usersByStatus = await usersCol
      .aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    // OAuth provider distribution
    const usersByProvider = await usersCol
      .aggregate([
        {
          $group: {
            _id: "$provider",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    // Prescription trends (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const prescriptionTrends = await prescriptionsCol
      .aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])
      .toArray();

    return NextResponse.json({
      message: "Analytics data fetched successfully",
      data: {
        userGrowth: userGrowth.map((item) => ({
          month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
          count: item.count,
        })),
        usersByRole: usersByRole.map((item) => ({
          role: item._id || "unknown",
          count: item.count,
        })),
        usersByStatus: usersByStatus.map((item) => ({
          status: item._id || "unknown",
          count: item.count,
        })),
        usersByProvider: usersByProvider.map((item) => ({
          provider: item._id || "local",
          count: item.count,
        })),
        prescriptionTrends: prescriptionTrends.map((item) => ({
          date: item._id,
          count: item.count,
        })),
      },
    });
  } catch (error) {
    const err = error as Error;
    if (err.message === "Unauthorized" || err.message === "Invalid token") {
      return NextResponse.json({ message: err.message }, { status: 401 });
    }
    console.error("Admin analytics GET error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 },
    );
  }
}
