import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/config";

const COOKIE_NAMES = [
  AUTH_COOKIE_NAME,
  "adminToken",
  "authUser",
  "authProvider",
  "oauth_state_google",
  "oauth_state_github",
  "oauth_state_apple",
];

function clearCookie(response: NextResponse, name: string) {
  response.cookies.set(name, "", {
    httpOnly:
      name === AUTH_COOKIE_NAME ||
      name === "adminToken" ||
      name.startsWith("oauth_state_"),
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  for (const cookieName of COOKIE_NAMES) {
    clearCookie(response, cookieName);
  }

  return response;
}

export async function GET() {
  return POST();
}
