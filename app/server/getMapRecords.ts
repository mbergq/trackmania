import { createServerFn } from "@tanstack/react-start";
import { tmCoreClient } from "@/constants";
import { z } from "zod";

const data = z.object({
	mapId: z.string(),
});

export const getMapRecordsFn = createServerFn({ method: "GET" })
	.validator(data)
	.handler(async ({ data }) => {
		// Naming the variable to records since I will return records for more than one person later on
		const records = await tmCoreClient.getMapRecords(data.mapId);
		const mapInfo = await tmCoreClient.getMapInfo(data.mapId);
		return { records: records, mapInfo: mapInfo };
	});
