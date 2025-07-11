import { db } from "@/lib/db";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const data = z.object({
	username: z.string(),
	password: z.string(),
});

export const createAccountFn = createServerFn({ method: "POST" })
	.validator(data)
	.handler(async ({ data }) => {
		const { username, password } = data;

		const res = db
			.query("SELECT 1 FROM app_user WHERE name = ? LIMIT 1")
			.all(username);

		if (res.length !== 0) {
			return { success: false, error: "Username already taken" };
		}

		const userId = crypto.randomUUID();
		const passwordHash = await Bun.password.hash(password);

		db.run("INSERT INTO app_user (id, name, password) VALUES (?, ?, ?)", [
			userId,
			username,
			passwordHash,
		]);

		return { success: true };
	});
