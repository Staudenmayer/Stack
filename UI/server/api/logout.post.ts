import { lucia } from "../utils/auth";
import log from "../utils/log";

export default eventHandler(async (event) => {
	if (!event.context.session) {
		log.notice(__filename + " User not logged in");
		throw createError({
			statusCode: 403
		});
	}
	await lucia.invalidateSession(event.context.session.id);
	appendHeader(event, "Set-Cookie", lucia.createBlankSessionCookie().serialize());
});