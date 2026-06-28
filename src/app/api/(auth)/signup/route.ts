import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/lib/crypto";
import { createLocalUser, findUserByEmail } from "@/lib/auth/user";
import { setAuthCookie } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(body.password ?? "");
    const role = String(body.role ?? "") as "doctor" | "patient" | "pharmacist";
    const mobileNumber = String(body.mobileNumber ?? "").trim() || undefined;
    const govId = String(body.govId ?? "").trim() || undefined;
    const specialization = body.specialization
      ? String(body.specialization).trim()
      : undefined;
    const bloodType = body.bloodType ? String(body.bloodType) : undefined;
    const age = body.age ? Number(body.age) : undefined;

    // ── Validation ─────────────────────────────────────────────────────────
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        {
          message:
            "firstName, lastName, email, password and role are all required.",
        },
        { status: 400 },
      );
    }

    const validRoles = ["doctor", "patient", "pharmacist"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { message: `Invalid role. Must be one of: ${validRoles.join(", ")}.` },
        { status: 400 },
      );
    }

    // ── Duplicate check ────────────────────────────────────────────────────
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 },
      );
    }

    // ── Create user ────────────────────────────────────────────────────────
    const created = await createLocalUser({
      firstName,
      lastName,
      email,
      mobileNumber,
      role,
      govId,
      password,
      age,
      bloodType,
      specialization,
    });

    // ── Issue JWT (2-day expiry) ───────────────────────────────────────────
    const token = await encrypt({
      userId: String(created._id),
      email: String(created.email),
      role: created.role as "doctor" | "patient" | "pharmacist",
      provider: "local",
    });

    // httpOnly cookie
    await setAuthCookie(token);

    return NextResponse.json(
      { message: "Account created successfully.", token, user: created },
      { status: 201 },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[POST /api/signup]", message);

    return NextResponse.json(
      {
        message: "Sign up failed. Please try again.",
        // expose detail in development so you can see the real error
        ...(process.env.NODE_ENV === "development" && { detail: message }),
      },
      { status: 500 },
    );
  }
}
