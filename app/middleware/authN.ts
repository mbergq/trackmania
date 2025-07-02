import { createMiddleware } from "@tanstack/react-start";
import { getCookie, getWebRequest } from "@tanstack/react-start/server";
import { db } from "@/lib/db";

type Session = {
	id: string;
	username: string;
};

const authN = createMiddleware().server(async ({ next }) => {
	const request = getWebRequest();
	if (!request) {
		throw new Error("Missing request");
	}
	const sessionId = await getCookie("authNCookie");
	if (!sessionId) {
		return await next({
			context: {
				isAuth: false,
				username: "",
			},
		});
	}

	const query = db.query("SELECT id, username FROM session WHERE id = ?");
	const result = query.all(sessionId) as unknown as Session[];

	return await next({
		context: {
			isAuth: result.length > 0,
			username: result[0].username,
		},
	});
});

export default authN;
