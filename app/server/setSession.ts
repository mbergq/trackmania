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

		const existingRows = db
			.query("SELECT id FROM session WHERE username = ?")
			.all(username) as { id: string }[];

		const sessionId = crypto.randomUUID();
		// Might add password as well later since identifying any username is kinda pointless
		if (existingRows.length !== 0) {
			db.run(
				"UPDATE session SET id = ?, modified_at = CURRENT_TIMESTAMP WHERE username = ?",
				[sessionId, username],
			);
		} else {
			db.run("INSERT INTO session (id, username) VALUES (?, ?)", [
				sessionId,
				username,
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
