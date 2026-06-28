import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_MAX_AGE_MS, AUTH_TOKEN_MAX_AGE_SECONDS } from "@/lib/auth/config";
import { decrypt } from "@/lib/crypto";

export type SafeAuthUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  mobileNumber?: string;
  govId?: string;
  role: "admin" | "doctor" | "patient" | "pharmacist";
  age?: number;
  bloodType?: string;
  specialization?: string;
  createdAt?: Date;
  status?: "pending" | "active";
  provider?: "local" | "google" | "github" | "apple";
  profilePicture?: string | null;
};

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_TOKEN_MAX_AGE_SECONDS,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function getClientSessionExpiry() {
  return Date.now() + AUTH_TOKEN_MAX_AGE_MS;
}

export async function getAuthenticatedTokenPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return decrypt(token);
}
