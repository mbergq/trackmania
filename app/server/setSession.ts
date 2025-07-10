import { db } from "@/lib/db";
import { createServerFn } from "@tanstack/react-start";
import { setCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import { PASSCODE } from "@/constants";

const data = z.object({
	username: z.string(),
	passcode: z.string(),
});

export const setSessionFn = createServerFn({ method: "POST" })
	.validator(data)
	.handler(async ({ data }) => {
		const { username, passcode } = data;
		if (passcode !== PASSCODE) {
			return { success: false, error: "Invalid passcode" };
		}

		const session = {
			id: crypto.randomUUID(),
			username: username,
		};
		setCookie("authNCookie", session.id, {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			maxAge: 3600, // 1 hour
			path: "/",
		});
		setCookie("username", username, {
			httpOnly: false,
			secure: true,
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});
		db.run("INSERT INTO session (id, username) VALUES (?, ?)", [
			session.id,
			session.username,
		]);

		return { success: true };
	});
