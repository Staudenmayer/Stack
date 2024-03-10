// server/routes/login/github/callback.get.ts
import { google, verifier } from "./index.get";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { pool } from "../../../utils/db";
import { QueryResult } from "pg";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code?.toString() ?? null;
  const state = query.state?.toString() ?? null;
  const storedState = getCookie(event, "google_oauth_state") ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    throw createError({
      status: 400,
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, verifier);
    const googleUserResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );
    const googleUser: googleUser = await googleUserResponse.json();

    const user = (await pool.query(`SELECT * FROM users WHERE googleid = $1`, [
      googleUser.sub,
    ])) as QueryResult<any>;
    const existingUser = user.rows[0] as DatabaseUser;

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      appendHeader(
        event,
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
      );
      return sendRedirect(event, "/");
    }

    const userId = generateId(15);

    try {
      await pool.query(
        "INSERT INTO users (id, email, googleid, username, password) VALUES($1, $2, $3, $4, 'Secret')",
        [userId, googleUser.email, googleUser.sub, googleUser.name],
      );
    } catch (e) {
      console.log(e);
      log.error("An unknown error occurred" + e);
      throw createError({
        message: "An unknown error occurred",
        statusCode: 500,
      });
    }

    const session = await lucia.createSession(userId, {});
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    );
    return sendRedirect(event, "/");
  } catch (e) {
    console.log(e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      throw createError({
        status: 400,
      });
    }
    throw createError({
      status: 500,
    });
  }
});

interface googleUser {
  sub: string;
  name: string;
  email: string;
}
