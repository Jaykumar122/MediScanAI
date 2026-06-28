import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/crypto";

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
  provider?: string;
}

/**
 * Extract and verify authentication token from request
 * @param req NextRequest object
 * @returns Authenticated user payload
 * @throws Error if unauthorized or invalid token
 */
export async function getAuthUser(req: NextRequest): Promise<AuthUser> {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  const payload = await decrypt(token);

  if (!payload?.userId) {
    throw new Error("Invalid token");
  }

  return payload as AuthUser;
}

/**
 * Verify if the authenticated user is an admin
 * @param req NextRequest object
 * @returns Authenticated admin user
 * @throws Error if not admin or unauthorized
 */
export async function requireAdmin(req: NextRequest): Promise<AuthUser> {
  const authUser = await getAuthUser(req);

  if (authUser.role !== "admin") {
    throw new Error("Forbidden: Admin access required");
  }

  return authUser;
}

/**
 * Standard error response handler
 * @param error Error object
 * @returns NextResponse with appropriate status
 */
export function handleApiError(error: Error | unknown): NextResponse {
  const err = error as Error;
  const message = err.message || "An internal server error occurred";

  // Authentication errors
  if (message === "Unauthorized" || message === "Invalid token") {
    return NextResponse.json({ message }, { status: 401 });
  }

  // Authorization errors
  if (message.startsWith("Forbidden")) {
    return NextResponse.json({ message }, { status: 403 });
  }

  // Validation errors
  if (message.startsWith("Invalid") || message.startsWith("Missing")) {
    return NextResponse.json({ message }, { status: 400 });
  }

  // Default server error
  console.error("API Error:", error);
  return NextResponse.json(
    { message: "An internal server error occurred" },
    { status: 500 },
  );
}

/**
 * Create a standardized success response
 * @param message Success message
 * @param data Response data
 * @param status HTTP status code (default: 200)
 * @returns NextResponse
 */
export function successResponse(
  message: string,
  data?: unknown,
  status: number = 200,
): NextResponse {
  return NextResponse.json(
    {
      message,
      ...(data !== undefined && { data }),
    },
    { status },
  );
}
