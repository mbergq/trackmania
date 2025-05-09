import { createServerFn } from "@tanstack/react-start";
import { createTrackmaniaClient } from "@/lib/trackmania";

export const fetchMapFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const trackmaniaCore = createTrackmaniaClient(
			process.env.SERVER_ACCOUNT_CREDENTIALS ?? "",
			"NadeoServices",
		);
		const trackmaniaLiveMeet = createTrackmaniaClient(
			process.env.SERVER_ACCOUNT_CREDENTIALS ?? "",
			"NadeoLiveServices",
		);

		const test = await trackmaniaLiveMeet.getClub();
		console.log(test);
		return test;
	},
);
