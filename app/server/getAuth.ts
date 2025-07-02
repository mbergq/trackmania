import authN from "@/middleware/authN";
import { createServerFn } from "@tanstack/react-start";

export const getAuth = createServerFn({ method: "GET" })
	.middleware([authN])
	.handler(async ({ context }) => {
		return context;
	});
