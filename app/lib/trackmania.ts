import jwt from "jsonwebtoken";

const userAgent = process.env.USER_AGENT ?? "";

type JwtPayload = {
	exp: number;
};

// Test
const mapId = "f6028124-f625-4037-96fd-1d8afcb3938c";
const clubId = "67811";

type CredentialsCache = {
	NadeoServices: {
		accessToken: string | undefined;
		accessTokenExpires: Date;
		refreshToken: string | undefined;
		refreshTokenExpires: Date;
	};
	NadeoLiveServices: {
		accessToken: string | undefined;
		accessTokenExpires: Date;
		refreshToken: string | undefined;
		refreshTokenExpires: Date;
	};
};

const credentialsCache: CredentialsCache = {
	NadeoServices: {
		accessToken: undefined,
		accessTokenExpires: new Date(Date.now() + 3600000),
		refreshToken: undefined,
		refreshTokenExpires: new Date(Date.now() + 86400000),
	},
	NadeoLiveServices: {
		accessToken: undefined,
		accessTokenExpires: new Date(Date.now() + 3600000),
		refreshToken: undefined,
		refreshTokenExpires: new Date(Date.now() + 86400000),
	},
};

const getTokens = async (
	apiKey: string,
	audience: "NadeoServices" | "NadeoLiveServices",
) => {
	const res = await fetch(
		"https://prod.trackmania.core.nadeo.online/v2/authentication/token/basic",
		{
			method: "post",
			headers: {
				Authorization: `Basic ${btoa(apiKey)}`,
				"User-Agent": userAgent,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ audience: audience }),
		},
	);
	return (await res.json()) as { accessToken: string; refreshToken: string };
};

const getAccessToken = async (
	apiKey: string,
	audience: "NadeoServices" | "NadeoLiveServices",
) => {
	const { accessToken, accessTokenExpires } = credentialsCache[audience];

	if (accessToken && new Date(Date.now()) <= accessTokenExpires) {
		console.log("--- Cache hit");
		return accessToken;
	}

	const tokens = await getTokens(apiKey, audience);

	const decodeAccessToken = jwt.decode(tokens.accessToken) as JwtPayload;
	const decodeRefreshToken = jwt.decode(tokens.refreshToken) as JwtPayload;

	credentialsCache[audience] = {
		accessToken: tokens.accessToken,
		accessTokenExpires: new Date(decodeAccessToken.exp * 1000),
		refreshToken: tokens.refreshToken,
		refreshTokenExpires: new Date(decodeRefreshToken.exp * 1000),
	};

	return credentialsCache[audience].accessToken;
};

const createTrackmaniaClient = (
	apiKey: string,
	audience: "NadeoServices" | "NadeoLiveServices",
) => {
	const client = async (url: string, options?: RequestInit) => {
		return fetch(url, {
			headers: {
				Authorization: `nadeo_v1 t=${await getAccessToken(apiKey, audience)}`,
				"Content-Type": "application/json",
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
		getClub: async () => {
			const res = await client(
				`https://live-services.trackmania.nadeo.live/api/token/club/${clubId}`,
			);
			return res.json();
		},
	};

	return trackmaniaClient;
};

export { createTrackmaniaClient };
