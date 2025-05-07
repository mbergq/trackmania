import { createServerFn } from "@tanstack/react-start";
import authCoreAPI from "@/middleware/authCoreAPI";

export const fetchMapsFn = createServerFn({ method: "GET" })
	.middleware([authCoreAPI])
	.handler(async ({ context }) => {
		console.log(await context.tokens);

		// return { tokens: await context.tokens };
	});
