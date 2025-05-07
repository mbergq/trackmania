import { createMiddleware } from "@tanstack/react-start";

const credentials = process.env.SERVER_ACCOUNT_CREDENTIALS ?? "";
const userAgent = process.env.USER_AGENT ?? "";

const authCoreAPI = createMiddleware().server(async ({ next }) => {
	const response = await fetch(
		"https://prod.trackmania.core.nadeo.online/v2/authentication/token/basic",
		{
			method: "POST",
			body: JSON.stringify({
				audience: "NadeoServices",
			}),
			headers: {
				Authorization: `Basic ${btoa(credentials)}`,
				"Content-Type": "application/json",
				"User-Agent": userAgent,
			},
		},
	);
	const tokens: Promise<{ accessToken: string; refreshToken: string }> =
		response.json();

	return next({
		context: {
			tokens,
		},
	});
});

export default authCoreAPI;
