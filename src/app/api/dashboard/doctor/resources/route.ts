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
  return payload;
}

function serialize(items: unknown[]) {
  return items.map((item) => {
    const obj = item as Record<string, unknown> & { _id?: { toString(): string } };
    return { ...obj, _id: obj._id?.toString?.() ?? obj._id };
  });
}

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (authUser.role !== "doctor") {
      return NextResponse.json({ message: "Forbidden: Doctor access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "team";
    const search = searchParams.get("search") || "";

    const db = await getDb();
    const usersCol = db.collection("users");
    const drugsCol = db.collection("drugs");

    const textFilter = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { specialization: { $regex: search, $options: "i" } },
            { name: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { manufacturer: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    if (type === "doctors") {
      const doctors = await usersCol
        .find(
          { role: "doctor", ...textFilter },
          { projection: { password: 0 } },
        )
        .sort({ firstName: 1, lastName: 1 })
        .toArray();
      return NextResponse.json({ message: "Doctors fetched", data: serialize(doctors) });
    }

    if (type === "pharmacy") {
      const pharmacists = await usersCol
        .find(
          { role: "pharmacist", ...textFilter },
          { projection: { password: 0 } },
        )
        .sort({ firstName: 1, lastName: 1 })
        .toArray();
      return NextResponse.json({ message: "Pharmacy fetched", data: serialize(pharmacists) });
    }

    if (type === "drugs") {
      const drugFilter = search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { category: { $regex: search, $options: "i" } },
              { manufacturer: { $regex: search, $options: "i" } },
            ],
          }
        : {};
      const drugs = await drugsCol.find(drugFilter).sort({ name: 1 }).toArray();
      return NextResponse.json({ message: "Drugs fetched", data: serialize(drugs) });
    }

    const team = await usersCol
      .find(
        { role: { $in: ["doctor", "pharmacist"] }, ...textFilter },
        { projection: { password: 0 } },
      )
      .sort({ role: 1, firstName: 1, lastName: 1 })
      .toArray();
    return NextResponse.json({ message: "Team fetched", data: serialize(team) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message === "Unauthorized" || message === "Invalid token") {
      return NextResponse.json({ message }, { status: 401 });
    }
    console.error("Doctor resources error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
