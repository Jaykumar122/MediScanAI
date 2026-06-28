import { NextRequest, NextResponse } from "next/server";
import { encrypt, decrypt } from "@/lib/crypto";
import {
  AUTH_COOKIE_NAME,
  AUTH_TOKEN_MAX_AGE_SECONDS,
} from "@/lib/auth/config";
import clientPromise from "@/dbConfig/dbConfig";
import { ObjectId } from "mongodb";

async function getDb() {
  const client = await clientPromise;
  return client.db("securerx");
}

export async function POST(req: NextRequest) {
  try {
    const { tempToken, role } = await req.json();

    if (!tempToken || !role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!["doctor", "patient", "pharmacist"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    // Decrypt the temporary token to get user data
    const tempData = await decrypt(tempToken);

    if (!tempData) {
      return NextResponse.json(
        { message: "Invalid or expired session" },
        { status: 401 },
      );
    }

    if (!tempData?.userId || !tempData?.email) {
      return NextResponse.json(
        { message: "Invalid session data" },
        { status: 401 },
      );
    }

    const db = await getDb();
    const usersCol = db.collection("users");

    // Update the user with the selected role
    const result = await usersCol.updateOne(
      { _id: new ObjectId(tempData.userId) },
      {
        $set: {
          role,
          status: "active",
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get the updated user
    const user = await usersCol.findOne({
      _id: new ObjectId(tempData.userId),
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Create a new JWT with the role
    const providerValue = (tempData.provider || "local") as
      "local" | "google" | "github" | "apple";

    const jwt = await encrypt({
      userId: String(user._id),
      email: user.email,
      role: user.role,
      provider: providerValue,
    });

    const response = NextResponse.json({
      message: "Registration completed successfully",
      token: jwt,
      user: {
        _id: String(user._id),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });

    // Set auth cookie
    response.cookies.set(AUTH_COOKIE_NAME, jwt, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: AUTH_TOKEN_MAX_AGE_SECONDS,
    });

    response.cookies.set("authProvider", providerValue, {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: AUTH_TOKEN_MAX_AGE_SECONDS,
    });

    response.cookies.set(
      "authUser",
      encodeURIComponent(
        JSON.stringify({
          _id: String(user._id),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        }),
      ),
      {
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: AUTH_TOKEN_MAX_AGE_SECONDS,
      },
    );

    return response;
  } catch (error) {
    console.error("Complete OAuth error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 },
    );
  }
}
