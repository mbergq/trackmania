import { createServerFn } from "@tanstack/react-start";
import { tmCoreClient } from "@/constants";
import { reformatIds } from "@/lib/utils";
import { z } from "zod";

export const getMapsInfoFn = createServerFn({ method: "GET" })
	.validator(
		z.object({
			start: z.number(),
			end: z.number(),
		}),
	)
	.handler(async ({ data }) => {
		const { responseData, numberOfRecords } = await tmCoreClient.getRecords();

		const mapIds: string[] = responseData.map((x) => x.mapId);

		const mapIdList = reformatIds(mapIds, 0, 200);

		const mapsInfo = await tmCoreClient.getMapsInfo(mapIdList);
		// console.log(mapsInfo);
		return { maps: mapsInfo, numberOfRecords: numberOfRecords };
	});
