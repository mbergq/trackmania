import { createServerFn } from "@tanstack/react-start";
import { tmCoreClient } from "@/constants";
import { insertMapsIntoDatabase, reformatIds, getRanges } from "@/lib/utils";

export const storeMapsFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const { responseData, numberOfRecords } = await tmCoreClient.getRecords();

		const mapIds: string[] = responseData.map((x) => x.mapId);

		const ranges = getRanges(numberOfRecords, 200);

		for (const range of ranges) {
			const mapIdList = reformatIds(mapIds, range.start, range.end);
			const mapsInfo = await tmCoreClient.getMapsInfo(mapIdList);
			insertMapsIntoDatabase(mapsInfo.responseData);
		}
	},
);
