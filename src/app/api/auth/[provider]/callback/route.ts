import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/lib/crypto";
import {
  AUTH_COOKIE_NAME,
  AUTH_TOKEN_MAX_AGE_SECONDS,
  SOCIAL_PROVIDER_DISPLAY_NAMES,
  type SocialProvider,
} from "@/lib/auth/config";
import {
  exchangeCodeForToken,
  fetchOAuthProfile,
  getMissingProviderEnvVars,
  getOAuthStateCookieName,
  getOAuthStateCookieOptions,
} from "@/lib/auth/oauth";
import { findOrCreateOAuthUser } from "@/lib/auth/user";

const supportedProviders = new Set<SocialProvider>([
  "google",
  "github",
  "apple",
]);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;

  if (!supportedProviders.has(provider as SocialProvider)) {
    return NextResponse.redirect(
      new URL("/login?error=unsupported_provider", req.url),
    );
  }

  const normalizedProvider = provider as SocialProvider;
  const missingEnvVars = getMissingProviderEnvVars(normalizedProvider);
  if (missingEnvVars.length > 0) {
    return NextResponse.redirect(
      new URL(`/login?error=${normalizedProvider}_not_configured`, req.url),
    );
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, req.url),
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_oauth_callback", req.url),
    );
  }

  try {
    const cookieStore = await cookies();
    const stateCookieName = getOAuthStateCookieName(normalizedProvider);
    const expectedState = cookieStore.get(stateCookieName)?.value;

    if (!expectedState || expectedState !== state) {
      return NextResponse.redirect(
        new URL("/login?error=invalid_oauth_state", req.url),
      );
    }

    cookieStore.set(stateCookieName, "", {
      ...getOAuthStateCookieOptions(),
      maxAge: 0,
    });

    const tokenData = await exchangeCodeForToken(
      normalizedProvider,
      code,
      req.url,
    );
    const profile = await fetchOAuthProfile(
      normalizedProvider,
      tokenData.access_token ?? "",
      tokenData.id_token,
    );

    if (!profile.email) {
      return NextResponse.redirect(
        new URL(`/signup?error=${normalizedProvider}_email_required`, req.url),
      );
    }

    const user = await findOrCreateOAuthUser(profile);

    // If user doesn't have a role yet (new OAuth user), redirect to role selection
    if (!user.role || user.role === "patient") {
      // Create a temporary token for role selection
      const tempToken = await encrypt({
        userId: user._id!,
        email: user.email!,
        provider: profile.provider,
        temp: true,
      });

      // Check if this is truly a new user or existing patient
      const isNewUser = !user.role;

      // If new user, redirect to role selection
      if (isNewUser) {
        const roleSelectionUrl = new URL("/role-selection", req.url);
        roleSelectionUrl.searchParams.set("token", tempToken);
        roleSelectionUrl.searchParams.set("provider", profile.provider);
        return NextResponse.redirect(roleSelectionUrl);
      }
    }

    // Existing user with role - proceed with login
    const jwt = await encrypt({
      userId: user._id!,
      email: user.email!,
      role: user.role!,
      provider: profile.provider,
    });

    const redirectPath =
      user.role === "doctor"
        ? "/dashboard/doctor"
        : user.role === "pharmacist"
          ? "/dashboard/pharmacist"
          : "/dashboard/patient";

    const response = NextResponse.redirect(new URL(redirectPath, req.url));
    response.cookies.set(AUTH_COOKIE_NAME, jwt, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: AUTH_TOKEN_MAX_AGE_SECONDS,
    });

    response.cookies.set("authProvider", profile.provider, {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: AUTH_TOKEN_MAX_AGE_SECONDS,
    });

    response.cookies.set("authUser", encodeURIComponent(JSON.stringify(user)), {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: AUTH_TOKEN_MAX_AGE_SECONDS,
    });

    return response;
  } catch (oauthError) {
    console.error(
      `${SOCIAL_PROVIDER_DISPLAY_NAMES[normalizedProvider]} OAuth callback error:`,
      oauthError,
    );
    return NextResponse.redirect(
      new URL(`/login?error=${normalizedProvider}_oauth_failed`, req.url),
    );
  }
}
