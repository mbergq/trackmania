import { createServerFn } from "@tanstack/react-start";
import { tmCoreClient } from "@/constants";

export const getRecordsFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const records = await tmCoreClient.getRecords();
		return records;
	},
);
