import { createServerFn } from "@tanstack/react-start";
import { createTrackmaniaClient } from "@/lib/trackmania";

export const fetchTestFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const { tmCoreClient } = createTrackmaniaClient("NadeoServices");

		const test = await tmCoreClient.getMapInfo();
		return test;
	},
);
