import { createServerFn } from "@tanstack/react-start";
import { tmCoreClient } from "@/constants";
import { z } from "zod";

const data = z.object({
	mapId: z.string(),
});

export const getMapRecordsFn = createServerFn({ method: "GET" })
	.validator(data)
	.handler(async ({ data }) => {
		const records = await tmCoreClient.getMapRecords(data.mapId);
		return records;
	});
