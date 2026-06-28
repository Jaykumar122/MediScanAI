"use server";

import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/crypto";
import clientPromise from "@/dbConfig/dbConfig";
import { ObjectId } from "mongodb";

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
    if (authUser.role !== "pharmacist") {
      return NextResponse.json(
        { message: "Forbidden: Pharmacist access required" },
        { status: 403 },
      );
    }

    const db = await getDb();
    const usersCol = db.collection("users");
    const drugsCol = db.collection("drugs");

    const pharmacist = await usersCol.findOne(
      { _id: new ObjectId(authUser.userId) },
      { projection: { firstName: 1, lastName: 1, email: 1, govId: 1 } },
    );

    if (!pharmacist) {
      return NextResponse.json(
        { message: "Pharmacist not found" },
        { status: 404 },
      );
    }

    const drugs = await drugsCol.find({}).sort({ createdAt: -1 }).toArray();

    const totalDrugs = drugs.length;
    const availableDrugs = drugs.filter((d) => d.status === "available").length;
    const lowStockDrugs = drugs.filter(
      (d) => typeof d.stock === "number" && d.stock < 10,
    ).length;

    return NextResponse.json({
      message: "Pharmacist dashboard data fetched successfully",
      data: {
        pharmacistInfo: {
          firstName: pharmacist.firstName,
          lastName: pharmacist.lastName,
          email: pharmacist.email,
          govId: pharmacist.govId,
        },
        stats: {
          totalDrugs,
          availableDrugs,
          lowStockDrugs,
        },
        drugs,
        recentScans: [],
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    if (msg === "Unauthorized" || msg === "Invalid token") {
      return NextResponse.json({ message: msg }, { status: 401 });
    }
    console.error("Pharmacist dashboard error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 },
    );
  }
}
