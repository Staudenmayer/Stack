import { Google, generateCodeVerifier, generateState } from "arctic";

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  "http://localhost:4444/login/google/callback",
);
export const state = generateState();
export const verifier = generateCodeVerifier();

export default defineEventHandler(async (event) => {
  const url = await google.createAuthorizationURL(state, verifier, {
    scopes: ["openid", "profile", "email"],
  });

  setCookie(event, "google_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });
  return sendRedirect(event, url.toString());
});
