import { createServerFn } from "@tanstack/react-start";
import { setCookie } from "@tanstack/react-start/server";

export const cookie = createServerFn({ method: "GET" }).handler(async () => {
	setCookie("authNCookie", "cookievalue");
	return "Success";
});
