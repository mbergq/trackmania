import { createServerFn } from "@tanstack/react-start";
import { tmCoreClient } from "@/constants";
import { z } from "zod";

const data = z.object({
	mapId: z.string(),
});

export const getMapInfoFn = createServerFn({ method: "GET" })
	.validator(data)
	.handler(async ({ data }) => {
		const mapInfo = await tmCoreClient.getMapInfo(data.mapId);
		console.log(mapInfo);
		return mapInfo;
	});
