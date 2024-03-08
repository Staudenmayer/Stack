import { Argon2id } from "oslo/password";
import { pool } from "../utils/db";
import { generateId } from "lucia";
import { lucia } from "../utils/auth";
import log from '../utils/log'

export default eventHandler(async (event) => {
	const body: Omit<DatabaseUser, "id"> = JSON.parse(await readRawBody(event) as string);
	const email = body.email;
	if (
		typeof email !== "string" ||
		email.length < 3 ||
		email.length > 31 ||
		!/^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b$/.test(email)
	) {
		log.notice("Invalid email " + email);
		throw createError({
			message: "Invalid email",
			statusCode: 400
		});
	}
	const password = body.password;
	if (typeof password !== "string" || password.length < 6 || password.length > 255) {
		log.notice("Invalid password");
		throw createError({
			message: "Invalid password",
			statusCode: 400
		});
	}

	const hashedPassword = await new Argon2id().hash(password);
	const userId = generateId(15);

	try {
		await pool.query("INSERT INTO users (id, email, password) VALUES($1, $2, $3)", [ userId, email, hashedPassword ]);
		const session = await lucia.createSession(userId, {});
		appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
	} catch (e) {
    	if(e instanceof Error && e.message === 'duplicate key value violates unique constraint "users_email_key"'){
		  log.notice("email already used");
		  throw createError({
			message: "email already used",
			statusCode: 500
		  });
		}
		log.error("An unknown error occurred" + e);
		throw createError({
			message: "An unknown error occurred",
			statusCode: 500
		});
	}
});