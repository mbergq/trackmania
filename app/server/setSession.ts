import { db } from "@/lib/db";
import { createServerFn } from "@tanstack/react-start";
import { setCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import { PASSCODE } from "@/constants";

const data = z.object({
	username: z.string(),
	password: z.string(),
	passcode: z.string(),
});

export const setSessionFn = createServerFn({ method: "POST" })
	.validator(data)
	.handler(async ({ data }) => {
		const { username, password, passcode } = data;
		if (passcode !== PASSCODE) {
			return { success: false, error: "Invalid passcode" };
		}
		const res = db
			.query("SELECT id, password FROM app_user WHERE name = ?")
			.all(username) as { id: string; password: string }[];

		const sessionId = crypto.randomUUID();

		let userId: string;

		if (res.length === 0) {
			return { success: false, error: "Invalid username" };
		}

		const storedHash = res[0].password;
		const isValid = await Bun.password.verify(password, storedHash);

		if (!isValid) {
			return { success: false, error: "Invalid password" };
		}

		userId = res[0].id;

		const existingSession = db
			.query("SELECT id FROM session WHERE userId = ?")
			.all(userId) as { id: string }[];

		if (existingSession.length !== 0) {
			db.run(
				"UPDATE session SET id = ?, modified_at = CURRENT_TIMESTAMP WHERE userId = ?",
				[sessionId, userId],
			);
		} else {
			db.run("INSERT INTO session (id, userId) VALUES (?, ?)", [
				sessionId,
				userId,
			]);
		}

		setCookie("authNCookie", sessionId, {
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

		return { success: true };
	});
