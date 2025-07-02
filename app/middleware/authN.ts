import { createMiddleware } from "@tanstack/react-start";
import { getCookie, getWebRequest } from "@tanstack/react-start/server";

const authN = createMiddleware().server(async ({ next }) => {
	const request = getWebRequest();

	if (!request) {
		throw new Error("Missing request");
	}

	const authState = await getCookie("authNCookie");

	return await next({
		context: {
			isAuth: authState,
		},
	});
});

export default authN;
