"use server";

import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/crypto";
import clientPromise from "@/dbConfig/dbConfig";

interface DashboardUserRecord {
  _id: { toString(): string } | string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  createdAt?: Date | string | null;
}

interface DashboardPrescriptionRecord {
  _id: { toString(): string } | string;
  patientName?: string;
  patient?: string;
  symptoms?: string;
  medications?: unknown;
  createdAt?: Date | string | null;
}

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
    const drugsCol = db.collection("drugs");

    // Calculate date ranges for analytics
    const now = new Date();
    const lastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalDoctors,
      totalPatients,
      totalPharmacists,
      totalPrescriptions,
      totalDrugs,
      activeUsers,
      pendingUsers,
      newUsersThisMonth,
      newUsersThisWeek,
      recentUsersRaw,
      recentPrescriptionsRaw,
    ] = await Promise.all([
      usersCol.countDocuments(),
      usersCol.countDocuments({ role: "doctor" }),
      usersCol.countDocuments({ role: "patient" }),
      usersCol.countDocuments({ role: "pharmacist" }),
      prescriptionsCol.countDocuments(),
      drugsCol.countDocuments(),
      usersCol.countDocuments({ status: "active" }),
      usersCol.countDocuments({ status: "pending" }),
      usersCol.countDocuments({ createdAt: { $gte: lastMonth } }),
      usersCol.countDocuments({ createdAt: { $gte: lastWeek } }),
      usersCol
        .find({}, { projection: { password: 0 } })
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray(),
      prescriptionsCol
        .find(
          {},
          {
            projection: {
              patientName: 1,
              symptoms: 1,
              medications: 1,
              createdAt: 1,
            },
          },
        )
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray(),
    ]);

    const recentUsers = (recentUsersRaw as DashboardUserRecord[]).map(
      (user) => ({
        ...user,
        _id: String(user._id),
        name:
          [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
          user.name ||
          user.email ||
          "Unknown User",
        status: String(user.status ?? "inactive"),
        role: String(user.role ?? "user"),
        createdAt: user.createdAt ?? null,
      }),
    );

    const recentPrescriptions = (
      recentPrescriptionsRaw as DashboardPrescriptionRecord[]
    ).map((prescription) => ({
      _id: String(prescription._id),
      patientName: String(
        prescription.patientName ?? prescription.patient ?? "Unknown Patient",
      ),
      symptoms: String(prescription.symptoms ?? "—"),
      medications: Array.isArray(prescription.medications)
        ? prescription.medications
        : [],
      createdAt: prescription.createdAt ?? null,
    }));

    return NextResponse.json({
      message: "Admin dashboard data fetched successfully",
      data: {
        totalUsers,
        totalDoctors,
        totalPatients,
        totalPharmacists,
        totalPrescriptions,
        totalDrugs,
        activeUsers,
        pendingUsers,
        newUsersThisMonth,
        newUsersThisWeek,
        recentUsers,
        recentPrescriptions,
        stats: {
          userGrowthMonth: newUsersThisMonth,
          userGrowthWeek: newUsersThisWeek,
          activePercentage:
            totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
        },
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message === "Unauthorized" || message === "Invalid token") {
      return NextResponse.json({ message }, { status: 401 });
    }
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 },
    );
  }
}
