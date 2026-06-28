import { SignJWT, jwtVerify } from "jose";

export interface JwtPayload {
  userId: string;
  email: string;
  role?: "admin" | "doctor" | "patient" | "pharmacist";
  provider?: "local" | "google" | "github" | "apple";
  temp?: boolean; // For temporary tokens during OAuth flow
  iat?: number;
  exp?: number;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET is missing or shorter than 32 characters. Set it in .env or .env.local",
    );
  }
  return new TextEncoder().encode(secret);
}

const ALG = "HS256";
const ISSUER = "urn:mediscanai:issuer";
const AUD = "urn:mediscanai:audience";

/** Signs a JWT that expires in 2 days. */
export async function encrypt(
  payload: Omit<JwtPayload, "iat" | "exp"> | Record<string, unknown>,
): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUD)
    .setExpirationTime("2d")
    .sign(getSecretKey());
}

/** Verifies and decodes a JWT. Returns null if invalid or expired. */
export async function decrypt<T = JwtPayload>(
  token: string,
): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      issuer: ISSUER,
      audience: AUD,
    });
    return payload as unknown as T;
  } catch {
    return null;
  }
}
