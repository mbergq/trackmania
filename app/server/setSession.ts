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
			.query("SELECT id, password FROM session WHERE username = ?")
			.all(username) as { id: string; password: string }[];

		const sessionId = crypto.randomUUID();

		if (res.length !== 0) {
			const storedHash = res[0].password;
			const isValid = await Bun.password.verify(password, storedHash);

			if (!isValid) {
				return { success: false, error: "Invalid password" };
			}

			db.run(
				"UPDATE session SET id = ?, modified_at = CURRENT_TIMESTAMP WHERE username = ?",
				[sessionId, username],
			);
		} else {
			const passwordHash = await Bun.password.hash(password);
			db.run("INSERT INTO session (id, username, password) VALUES (?, ?, ?)", [
				sessionId,
				username,
				passwordHash,
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
