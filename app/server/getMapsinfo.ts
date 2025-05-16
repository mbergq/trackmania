import { db } from "@/lib/db";
import type { MapsInfo } from "@/types";
import { createServerFn } from "@tanstack/react-start";

export const getMapsInfoFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const res = db.query("select * from maps").all() as MapsInfo;
		const data = res.map((x) => ({
			...x,
			thumbnailUrl: x.thumbnail_url,
		}));

		return data;
	},
);
