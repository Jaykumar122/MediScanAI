import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  buildAuthorizationUrl,
  createOAuthState,
  getMissingProviderEnvVars,
  getOAuthStateCookieName,
  getOAuthStateCookieOptions,
} from "@/lib/auth/oauth";
import {
  SOCIAL_PROVIDER_DISPLAY_NAMES,
  type SocialProvider,
} from "@/lib/auth/config";

const supportedProviders = new Set<SocialProvider>([
  "google",
  "github",
  "apple",
]);

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;

  if (!supportedProviders.has(provider as SocialProvider)) {
    return NextResponse.json(
      { message: "Unsupported social provider" },
      { status: 404 },
    );
  }

  const normalizedProvider = provider as SocialProvider;
  const missingEnvVars = getMissingProviderEnvVars(normalizedProvider);

  if (missingEnvVars.length > 0) {
    return NextResponse.json(
      {
        message: `${SOCIAL_PROVIDER_DISPLAY_NAMES[normalizedProvider]} login is not configured`,
        details: `Missing environment variables: ${missingEnvVars.join(", ")}`,
      },
      { status: 501 },
    );
  }

  try {
    const state = createOAuthState(normalizedProvider);
    const authorizationUrl = buildAuthorizationUrl(
      normalizedProvider,
      state,
      _req.url,
    );
    const cookieStore = await cookies();
    cookieStore.set(
      getOAuthStateCookieName(normalizedProvider),
      state,
      getOAuthStateCookieOptions(),
    );
    return NextResponse.redirect(authorizationUrl);
  } catch (error) {
    console.error(`${normalizedProvider} OAuth init error:`, error);
    return NextResponse.json(
      {
        message: `Failed to start ${SOCIAL_PROVIDER_DISPLAY_NAMES[normalizedProvider]} login`,
      },
      { status: 500 },
    );
  }
}
