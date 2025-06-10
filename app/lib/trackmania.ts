import jwt from "jsonwebtoken";
import { ACCOUNT_ID } from "@/constants";
import type { MapInfo, MapRecords, MapsInfo, Records } from "@/types";
import { throttle } from "./utils/server-utils";

const userAgent = process.env.USER_AGENT ?? "";
const ubiCredentials = process.env.UBI_CREDENTIALS ?? "";
// Will add another account here later
const accountIdList = process.env.ACCOUNT_ID ?? "";

type JwtPayload = {
	exp: number;
};

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
	const requestThrottler = throttle();

	const client = async (url: string, options?: RequestInit) => {
		return requestThrottler(async () => {
			return fetch(url, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `nadeo_v1 t=${await getAccessToken(audience)}`,
					...options?.headers,
				},
				...options,
			});
		});
	};

	const tmCoreClient = {
		getRecords: async () => {
			const res = await client(
				`https://prod.trackmania.core.nadeo.online/v2/accounts/${ACCOUNT_ID}/mapRecords`,
			);
			const data: Promise<Records> = res.json();
			console.log("--- getRecords executed");
			return { responseData: await data };
		},
		getMapInfo: async (mapId: string) => {
			const res = await client(
				`https://prod.trackmania.core.nadeo.online/maps/${mapId}`,
			);
			const data: Promise<MapInfo> = res.json();
			console.log("--- getMapInfo executed");
			return { responseData: await data };
		},
		getMapsInfo: async (mapIds: string) => {
			const res = await client(
				`https://prod.trackmania.core.nadeo.online/maps/?mapIdList=${mapIds}`,
			);
			const data: Promise<MapsInfo> = res.json();
			console.log("Length of mapsInfo:", (await data).length);
			return { responseData: await data };
		},
		getMapRecords: async (mapId: string) => {
			const res = await client(
				`https://prod.trackmania.core.nadeo.online/v2/mapRecords/?accountIdList=${accountIdList}&mapId=${mapId}`,
			);
			const data: Promise<MapRecords> = res.json();
			console.log("--- getMapRecords executed");
			return { responseData: await data };
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
	};

	return { tmCoreClient, tmLiveMeetClient };
};

export { createTrackmaniaClient };
