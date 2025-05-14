import { createServerFn } from "@tanstack/react-start";
import { tmCoreClient } from "@/constants";
import { reformatIds } from "@/lib/utils";

export const getMapsInfoFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const records = await tmCoreClient.getRecords();

		const mapIds: string[] = records.map((x) => x.mapId);

		const mapIdList = reformatIds(mapIds, 0, 50);

		const mapsInfo = await tmCoreClient.getMapsInfo(mapIdList);
		// console.log(mapsInfo);
		return mapsInfo;
	},
);
