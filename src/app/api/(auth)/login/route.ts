import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/lib/crypto";
import { findUserByEmail, sanitizeUser } from "@/lib/auth/user";
import { setAuthCookie } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 },
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email. Please sign up." },
        { status: 404 },
      );
    }

    if (user.role === "admin") {
      return NextResponse.json(
        { message: "Admin accounts must use the admin portal." },
        { status: 403 },
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { message: "Incorrect password. Please try again." },
        { status: 401 },
      );
    }

    const token = await encrypt({
      userId: String(user._id),
      email: user.email,
      role: user.role,
      provider:
        ((user as Record<string, unknown>).provider as "local") ?? "local",
    });

    await setAuthCookie(token);

    return NextResponse.json({
      message: "Login successful.",
      token,
      user: sanitizeUser(user),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[POST /api/login]", message);

    return NextResponse.json(
      {
        message: "Login failed. Please try again.",
        ...(process.env.NODE_ENV === "development" && { detail: message }),
      },
      { status: 500 },
    );
  }
}
