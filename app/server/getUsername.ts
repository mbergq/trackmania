import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

export const getUsernameFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const username = getCookie("username");
		return {
			username,
		};
	},
);
