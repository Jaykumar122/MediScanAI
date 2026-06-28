"use server";

import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/crypto";
import clientPromise from "@/dbConfig/dbConfig";
import { ObjectId } from "mongodb";

const USERS_COLLECTION = "users";
const PRESCRIPTIONS_COLLECTION = "prescriptions";

async function getDb() {
  const client = await clientPromise;
  return client.db("securerx");
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 401 },
      );
    }
    const token = authHeader.split(" ")[1];

    const decryptedPayload = await decrypt(token);

    if (!decryptedPayload || !decryptedPayload.userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    const userId = decryptedPayload.userId as string;

    const db = await getDb();
    const usersCollection = db.collection(USERS_COLLECTION);

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json(
        { message: "Patient not found" },
        { status: 404 },
      );
    }

    // Fetch prescriptions for the patient (doctorId stored on prescription enables doctor-scoped queries)
    const prescriptionsCollection = db.collection(PRESCRIPTIONS_COLLECTION);
    const prescriptions = await prescriptionsCollection
      .find({ patientId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();

    const { password, ...patientInfo } = user;

    const serializablePrescriptions = prescriptions.map((p) => ({
      ...p,
      _id: p._id.toString(),
      patientId: p.patientId?.toString?.() ?? null,
      doctorId: p.doctorId?.toString?.() ?? null,
      createdAt:
        p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    }));

    const dashboardData = {
      patientInfo,
      prescriptions: serializablePrescriptions,
      // Placeholder arrays — populate once appointments/medications collections exist
      appointments: [],
      medications: [],
      testResults: [],
      vitalSigns: null,
    };

    return NextResponse.json({
      message: "Dashboard data fetched successfully",
      data: dashboardData,
    });
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 },
    );
  }
}
