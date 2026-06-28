export const AUTH_DB_NAME = "securerx";
export const AUTH_USERS_COLLECTION = "users";
export const AUTH_COOKIE_NAME = "authToken";
export const AUTH_TOKEN_MAX_AGE_SECONDS = 2 * 24 * 60 * 60;
export const AUTH_TOKEN_MAX_AGE_MS = AUTH_TOKEN_MAX_AGE_SECONDS * 1000;

export const SOCIAL_PROVIDER_DISPLAY_NAMES = {
  google: "Google",
  github: "GitHub",
  apple: "Apple",
} as const;

export type SocialProvider = keyof typeof SOCIAL_PROVIDER_DISPLAY_NAMES;
