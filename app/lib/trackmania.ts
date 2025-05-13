import jwt from "jsonwebtoken";

const userAgent = process.env.USER_AGENT ?? "";
const ubiCredentials = process.env.UBI_CREDENTIALS ?? "";

type JwtPayload = {
	exp: number;
};

// Test
const mapId = "f6028124-f625-4037-96fd-1d8afcb3938c";
const clubId = "67811";

type CredentialsCache = {
	ticket: {
		value: string | undefined;
		expiration: Date;
	};
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
	ticket: {
		value: undefined,
		expiration: new Date(Date.now() + 3300000),
	},
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

const getTicket = async () => {
	const { ticket } = credentialsCache;

	if (ticket.value && new Date(Date.now()) <= ticket.expiration) {
		console.log("--- Cache hit for ticket");
		return ticket.value;
	}

	const res = await fetch(
		"https://public-ubiservices.ubi.com/v3/profiles/sessions",
		{
			method: "post",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Basic ${btoa(ubiCredentials)}`,
				"User-Agent": userAgent,
				"Ubi-AppId": "86263886-327a-4328-ac69-527f0d20a237",
			},
		},
	);
	const data = await res.json();
	ticket.value = data.ticket;

	return data.ticket as { ticket: string };
};

const getTokens = async (audience: "NadeoServices" | "NadeoLiveServices") => {
	const res = await fetch(
		"https://prod.trackmania.core.nadeo.online/v2/authentication/token/ubiservices",
		{
			method: "post",
			headers: {
				"Content-Type": "application/json",
				Authorization: `ubi_v1 t=${await getTicket()}`,
				"User-Agent": userAgent,
			},
			body: JSON.stringify({ audience: audience }),
		},
	);
	return (await res.json()) as { accessToken: string; refreshToken: string };
};

const getAccessToken = async (
	audience: "NadeoServices" | "NadeoLiveServices",
) => {
	const { accessToken, accessTokenExpires } = credentialsCache[audience];

	if (accessToken && new Date(Date.now()) <= accessTokenExpires) {
		console.log("--- Cache hit for token");
		return accessToken;
	}

	const tokens = await getTokens(audience);

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
	audience: "NadeoServices" | "NadeoLiveServices",
) => {
	const client = async (url: string, options?: RequestInit) => {
		return fetch(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `nadeo_v1 t=${await getAccessToken(audience)}`,
				...options?.headers,
			},
			...options,
		});
	};

	const tmCoreClient = {
		getMapInfo: async () => {
			const res = await client(
				`https://prod.trackmania.core.nadeo.online/maps/${mapId}`,
			);
			return res.json();
		},
	};
	const tmLiveMeetClient = {
		getCOTD: async () => {
			const res = await client(
				"https://meet.trackmania.nadeo.club/api/cup-of-the-day/current",
			);
			if (res.status === 204) {
				throw new Error("No COTD ongoing");
			}
			return res.json();
		},
		getClub: async () => {
			const res = await client(
				`https://live-services.trackmania.nadeo.live/api/token/club/${clubId}`,
			);
			return res.json();
		},
	};

	return { tmCoreClient, tmLiveMeetClient };
};

export { createTrackmaniaClient };
