import { db } from "@/lib/db";
import { createServerFn } from "@tanstack/react-start";
import { setCookie } from "@tanstack/react-start/server";
import { z } from "zod";

const data = z.object({
	username: z.string(),
});

export const setSessionFn = createServerFn({ method: "POST" })
	.validator(data)
	.handler(async ({ data }) => {
		const session = {
			id: crypto.randomUUID(),
			username: data.username,
		};
		setCookie("authNCookie", session.id, {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			maxAge: 3600,
			path: "/",
		});
		db.run("INSERT INTO session (id, username) VALUES (?, ?)", [
			session.id,
			session.username,
		]);
	});
