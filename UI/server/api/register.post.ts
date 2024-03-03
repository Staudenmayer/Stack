import { Argon2id } from "oslo/password";
import { pool } from "../utils/db";
import { generateId } from "lucia";
import { lucia } from "../utils/auth";

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

	const hashedPassword = await new Argon2id().hash(password);
	const userId = generateId(15);

	try {
		await pool.query("INSERT INTO users (id, username, password) VALUES($1, $2, $3)", [ userId, username, hashedPassword ]);
		const session = await lucia.createSession(userId, {});
		appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
	} catch (e) {
    	if(e instanceof Error && e.message === 'duplicate key value violates unique constraint "users_username_key"'){
		  throw createError({
			message: "Username already used",
			statusCode: 500
		  });
		}
		throw createError({
			message: "An unknown error occurred",
			statusCode: 500
		});
	}
});