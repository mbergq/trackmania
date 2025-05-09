import { createServerFn } from "@tanstack/react-start";
import { createTrackmaniaClient } from "@/lib/trackmania";

export const fetchMapFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const trackmania = createTrackmaniaClient(
			process.env.SERVER_ACCOUNT_CREDENTIALS ?? "",
		);

		const mapInfo = await trackmania.getMapInfo();
		// console.log(mapInfo);
		return mapInfo;
	},
);
