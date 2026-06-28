import { NextResponse } from "next/server";
import { getAuthenticatedTokenPayload } from "@/lib/auth/session";

export async function GET() {
  try {
    const payload = await getAuthenticatedTokenPayload();
    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, session: payload });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[GET /api/session]", message);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
