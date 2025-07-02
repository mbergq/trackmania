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
		const UUID = crypto.randomUUID();
		const session = {
			id: UUID,
			username: data.username,
		};
		setCookie("authNCookie", session.id);
		db.run("INSERT INTO session (id, username) VALUES (?, ?)", [
			session.id,
			session.username,
		]);
	});
