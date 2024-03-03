import { Argon2id } from "oslo/password";
import { pool } from "../utils/db";
import type { DatabaseUser } from "../utils/db";
import { lucia } from "../utils/auth";
import { QueryResult } from "pg";

export default eventHandler(async (event) => {
	const body: Omit<DatabaseUser, "id"> = JSON.parse(await readRawBody(event) as string);
	const username = body.username;
	if (
		typeof username !== "string" ||
		username.length < 3 ||
		username.length > 31 ||
		!/^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b$/.test(username)
	) {
		throw createError({
			message: "Invalid username",
			statusCode: 400
		});
	}
	const password = body.password;
	if (typeof password !== "string" || password.length < 6 || password.length > 255) {
		throw createError({
			message: "Invalid password",
			statusCode: 400
		});
	}

	const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]) as QueryResult<any>;
  	const existingUser = user.rows[0] as DatabaseUser;
	if (!existingUser) {
		throw createError({
			message: "Incorrect username or password",
			statusCode: 400
		});
	}

	const validPassword = await new Argon2id().verify(existingUser.password, password);
	if (!validPassword) {
		throw createError({
			message: "Incorrect username or password",
			statusCode: 400
		});
	}

	const session = await lucia.createSession(existingUser.id, {});
	appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
});