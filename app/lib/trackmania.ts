const userAgent = process.env.USER_AGENT ?? "";

// Test
const mapId = "f6028124-f625-4037-96fd-1d8afcb3938c";

type CredentialsCache = {
	accessToken: string | undefined;
	accessTokenExpires: Date;
	refreshToken: string | undefined;
	refreshTokenExpires: Date;
};

const credentialsCache: CredentialsCache = {
	accessToken: undefined,
	// One hour in milliseconds
	accessTokenExpires: new Date(Date.now() + 3600000),
	refreshToken: undefined,
	// 24 hours in milliseconds
	refreshTokenExpires: new Date(Date.now() + 86400000),
};

const getTokens = async (apiKey: string) => {
	const res = await fetch(
		"https://prod.trackmania.core.nadeo.online/v2/authentication/token/basic",
		{
			method: "post",
			headers: {
				Authorization: `Basic ${btoa(apiKey)}`,
			},
			body: JSON.stringify({ audience: "NadeoServices" }),
		},
	);

	return (await res.json()) as { accessToken: string; refreshToken: string };
};

const getAccessToken = async (apiKey: string) => {
	const { accessToken, accessTokenExpires } = credentialsCache;

	if (accessToken && new Date() <= accessTokenExpires) {
		return credentialsCache.accessToken;
	}

	const tokens = await getTokens(apiKey);

	credentialsCache.accessToken = tokens.accessToken;
	credentialsCache.refreshToken = tokens.refreshToken;

	return tokens.accessToken;
};

const createTrackmaniaClient = (apiKey: string) => {
	const client = async (url: string, options?: RequestInit) => {
		return fetch(url, {
			headers: {
				Authorization: `nadeo_v1 t=${await getAccessToken(apiKey)}`,
				"Content-Type": "application/json",
				"User-Agent": userAgent,
				...options?.headers,
			},
			...options,
		});
	};

	const trackmaniaClient = {
		getMapInfo: async () => {
			const res = await client(
				`https://prod.trackmania.core.nadeo.online/maps/${mapId}`,
			);
			return res.json();
		},
	};

	return trackmaniaClient;
};

export { createTrackmaniaClient };
