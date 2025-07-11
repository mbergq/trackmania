import { createMiddleware } from "@tanstack/react-start";
import { getCookie, getWebRequest } from "@tanstack/react-start/server";
import { db } from "@/lib/db";
import { z } from "zod";

type Session = {
	id: string;
	name: string;
};

const authN = createMiddleware().server(async ({ next }) => {
	const request = getWebRequest();
	if (!request) {
		throw new Error("Missing request");
	}
	if (
		typeof request.method !== "string" ||
		!request.headers ||
		typeof request.headers.get !== "function"
	) {
		throw new Error("Invalid web request");
	}

	const userAgent = request.headers.get("user-agent") || "";
	if (!userAgent) {
		throw new Error("User-Agent header missing");
	}

	const sessionIdRaw = await getCookie("authNCookie");
	if (!sessionIdRaw) {
		return await next({
			context: {
				isAuth: false,
				username: "",
			},
		});
	}

	let sessionId: string;

	try {
		sessionId = z.string().uuid().parse(sessionIdRaw);
	} catch {
		return await next({
			context: {
				isAuth: false,
				username: "",
			},
		});
	}

	const query = db.query(
		"SELECT s.id, u.name FROM session s JOIN app_user u ON u.id = s.userId WHERE s.id = ?",
	);
	const result = query.all(sessionId) as unknown as Session[];

	return await next({
		context: {
			isAuth: result.length > 0,
			username: result.length > 0 ? result[0].name : "",
		},
	});
});

export default authN;
