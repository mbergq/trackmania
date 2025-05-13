import { createServerFn } from "@tanstack/react-start";
import { createTrackmaniaClient } from "@/lib/trackmania";

export const fetchMapFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const { tmCoreClient } = createTrackmaniaClient("NadeoServices");
		const { tmLiveMeetClient } = createTrackmaniaClient("NadeoLiveServices");

		const test = await tmLiveMeetClient.getClub();
		console.log(test);
		// const COTD = await tmLiveMeetClient.getCOTD();
		// console.log(COTD);
		// return COTD;
	},
);
