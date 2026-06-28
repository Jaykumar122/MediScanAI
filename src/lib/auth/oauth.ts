import { randomBytes } from "crypto";
import {
  AUTH_TOKEN_MAX_AGE_SECONDS,
  SOCIAL_PROVIDER_DISPLAY_NAMES,
  type SocialProvider,
} from "@/lib/auth/config";

export function getOAuthRedirectUri(
  provider: SocialProvider,
  currentUrl?: string,
) {
  // Try to get the base URL from environment or current request
  let baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;

  // If no env URL and we have a current URL, extract the origin
  if (!baseUrl && currentUrl) {
    try {
      const url = new URL(currentUrl);
      baseUrl = url.origin;
    } catch (error) {
      console.error("Failed to parse current URL:", error);
    }
  }

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_APP_URL or APP_URL must be configured for social login",
    );
  }

  return `${baseUrl.replace(/\/$/, "")}/api/auth/${provider}/callback`;
}

export function createOAuthState(provider: SocialProvider) {
  return `${provider}:${randomBytes(24).toString("hex")}`;
}

export function getOAuthStateCookieName(provider: SocialProvider) {
  return `oauth_state_${provider}`;
}

export function getOAuthStateCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_TOKEN_MAX_AGE_SECONDS,
  };
}

export function getProviderConfig(provider: SocialProvider) {
  switch (provider) {
    case "google":
      return {
        authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenUrl: "https://oauth2.googleapis.com/token",
        userInfoUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        scopes: ["openid", "email", "profile"],
      };
    case "github":
      return {
        authorizationUrl: "https://github.com/login/oauth/authorize",
        tokenUrl: "https://github.com/login/oauth/access_token",
        userInfoUrl: "https://api.github.com/user",
        emailUrl: "https://api.github.com/user/emails",
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        scopes: ["read:user", "user:email"],
      };
    case "apple":
      return {
        authorizationUrl: "https://appleid.apple.com/auth/authorize",
        tokenUrl: "https://appleid.apple.com/auth/token",
        clientId: process.env.APPLE_CLIENT_ID,
        clientSecret: process.env.APPLE_CLIENT_SECRET,
        scopes: ["name", "email"],
      };
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

export function getMissingProviderEnvVars(provider: SocialProvider) {
  const config = getProviderConfig(provider);
  const missing: string[] = [];

  if (!config.clientId) missing.push(`${provider.toUpperCase()}_CLIENT_ID`);
  if (!config.clientSecret)
    missing.push(`${provider.toUpperCase()}_CLIENT_SECRET`);

  return missing;
}

export function buildAuthorizationUrl(
  provider: SocialProvider,
  state: string,
  currentUrl?: string,
) {
  const config = getProviderConfig(provider);
  const redirectUri = getOAuthRedirectUri(provider, currentUrl);
  const params = new URLSearchParams({
    client_id: config.clientId ?? "",
    redirect_uri: redirectUri,
    response_type: provider === "apple" ? "code" : "code",
    scope: config.scopes.join(" "),
    state,
  });

  if (provider === "google") {
    params.set("access_type", "offline");
    params.set("prompt", "consent");
  }

  if (provider === "apple") {
    params.set("response_mode", "form_post");
  }

  return `${config.authorizationUrl}?${params.toString()}`;
}

export async function exchangeCodeForToken(
  provider: SocialProvider,
  code: string,
  currentUrl?: string,
) {
  const config = getProviderConfig(provider);
  const redirectUri = getOAuthRedirectUri(provider, currentUrl);

  const body = new URLSearchParams({
    client_id: config.clientId ?? "",
    client_secret: config.clientSecret ?? "",
    code,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `${SOCIAL_PROVIDER_DISPLAY_NAMES[provider]} token exchange failed: ${details}`,
    );
  }

  return response.json() as Promise<{
    access_token?: string;
    id_token?: string;
  }>;
}

export async function fetchOAuthProfile(
  provider: SocialProvider,
  accessToken: string,
  idToken?: string,
) {
  if (provider === "google") {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    if (!response.ok) throw new Error("Failed to load Google profile");
    const profile = (await response.json()) as Record<string, unknown>;
    return {
      providerId: String(profile.sub ?? ""),
      email: String(profile.email ?? ""),
      firstName: String(profile.given_name ?? "User"),
      lastName: String(profile.family_name ?? ""),
      profilePicture:
        typeof profile.picture === "string" ? profile.picture : null,
      provider: "google" as const,
    };
  }

  if (provider === "github") {
    const profileResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (!profileResponse.ok) throw new Error("Failed to load GitHub profile");
    const profile = (await profileResponse.json()) as Record<string, unknown>;

    let email = typeof profile.email === "string" ? profile.email : "";
    if (!email) {
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      });
      if (emailResponse.ok) {
        const emails = (await emailResponse.json()) as Array<{
          email: string;
          primary?: boolean;
          verified?: boolean;
        }>;
        email =
          emails.find((item) => item.primary && item.verified)?.email ||
          emails.find((item) => item.verified)?.email ||
          "";
      }
    }

    const name =
      typeof profile.name === "string" ? profile.name : "GitHub User";
    const [firstName, ...rest] = name.split(" ");
    return {
      providerId: String(profile.id ?? ""),
      email,
      firstName: firstName || "GitHub",
      lastName: rest.join(" "),
      profilePicture:
        typeof profile.avatar_url === "string" ? profile.avatar_url : null,
      provider: "github" as const,
    };
  }

  if (provider === "apple") {
    if (!idToken) {
      throw new Error("Apple login did not return an id_token");
    }

    const payload = JSON.parse(
      Buffer.from(idToken.split(".")[1], "base64").toString("utf8"),
    ) as Record<string, unknown>;
    const email = typeof payload.email === "string" ? payload.email : "";

    return {
      providerId: String(payload.sub ?? ""),
      email,
      firstName: "Apple",
      lastName: "User",
      profilePicture: null,
      provider: "apple" as const,
    };
  }

  throw new Error(`Unsupported provider: ${provider}`);
}
