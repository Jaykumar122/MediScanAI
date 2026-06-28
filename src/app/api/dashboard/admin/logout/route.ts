"use server";

import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/crypto";
import { AUTH_COOKIE_NAME } from "@/lib/auth/config";
import clientPromise from "@/dbConfig/dbConfig";

async function getDb() {
  const client = await clientPromise;
  return client.db("securerx");
}

/**
 * POST /api/dashboard/admin/logout
 *
 * Admin logout endpoint with activity logging
 * - Logs the logout event to activity log
 * - Clears all authentication cookies
 * - Returns success response
 */
export async function POST(req: NextRequest) {
  try {
    // Extract user from JWT (optional - to log who logged out)
    let adminEmail = "unknown";
    let adminId = "unknown";

    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const payload = await decrypt(token);
        if (payload?.email) adminEmail = payload.email;
        if (payload?.userId) adminId = payload.userId;
      } catch {
        // Ignore JWT errors during logout
      }
    }

    // Log admin logout activity
    try {
      const db = await getDb();
      const activityCol = db.collection("activity_logs");
      await activityCol.insertOne({
        type: "admin_logout",
        data: {
          adminEmail,
          adminId,
          timestamp: new Date(),
          userAgent: req.headers.get("user-agent"),
          ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        },
        timestamp: new Date(),
      } as Record<string, unknown>);
    } catch (logError) {
      console.error("Failed to log admin logout:", logError as Error);
      // Don't fail logout if logging fails
    }

    // Create response
    const response = NextResponse.json(
      {
        message: "Admin logged out successfully",
        data: {
          email: adminEmail,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 },
    );

    // Clear all authentication cookies
    response.cookies.set(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    response.cookies.set("authProvider", "", {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    response.cookies.set("authUser", "", {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    // Add cache-control headers to prevent caching of authenticated pages
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("Admin logout error:", error);

    // Still clear cookies even if there's an error
    const response = NextResponse.json(
      { message: "Logout completed (with warnings)" },
      { status: 200 },
    );

    response.cookies.set(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    return response;
  }
}

/**
 * GET /api/dashboard/admin/logout
 *
 * Also support GET for logout links
 */
export async function GET(req: NextRequest) {
  // Redirect to POST by creating a response that looks like the POST handler
  const postRequest = new NextRequest(req, { method: "POST" });
  return POST(postRequest);
}
