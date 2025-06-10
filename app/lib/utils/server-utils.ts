import { db } from "../db/index";
import type { MapsInfo } from "@/types";

export const throttle = () => {
	let lastCallTime = 0;

	return async <T>(fn: () => Promise<T>): Promise<T> => {
		const now = Date.now();
		const timeSinceLastCall = now - lastCallTime;
		const throttleDelay = 1000;

		if (timeSinceLastCall < throttleDelay) {
			const waitTime = throttleDelay - timeSinceLastCall;
			await new Promise((resolve) => setTimeout(resolve, waitTime));
		}

		lastCallTime = Date.now();
		return fn();
	};
};

export const reformatIds = (ids: string[], start: number, end: number) => {
	return ids
		.slice(start, end)
		.map((id) => id)
		.join(",");
};

export const insertMapsIntoDatabase = (maps: MapsInfo) => {
	try {
		db.transaction(() => {
			for (const map of maps) {
				const insertSql = `
					INSERT OR REPLACE INTO maps (
						map_id, map_uid, name, author, author_score, bronze_score, silver_score,
						gold_score, collection_name, created_with_gamepad_editor,
						created_with_simple_editor, file_url, filename, is_playable, map_style,
						map_type, submitter, thumbnail_url, timestamp
					) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
				`;

				db.run(insertSql, [
					map.mapId,
					map.mapUid,
					map.name,
					map.author,
					map.authorScore,
					map.bronzeScore,
					map.silverScore,
					map.goldScore,
					map.collectionName,
					map.createdWithGamepadEditor ? 1 : 0,
					map.createdWithSimpleEditor ? 1 : 0,
					map.fileUrl,
					map.filename,
					map.isPlayable ? 1 : 0,
					map.mapStyle,
					map.mapType,
					map.submitter,
					map.thumbnailUrl,
					map.timestamp instanceof Date
						? Math.floor(map.timestamp.getTime() / 1000)
						: Math.floor(new Date(map.timestamp).getTime() / 1000),
				]);
			}
		})();
		console.log(`Successfully inserted ${maps.length} maps into the database`);
	} catch (error) {
		console.error("Error inserting maps into database:", error);
	}
};

export const getRanges = (
	totalRecords: number,
	lengthOfIds: number,
): Array<{ start: number; end: number }> => {
	const amountOfIdArrays = Math.ceil(totalRecords / lengthOfIds);
	const ranges: Array<{ start: number; end: number }> = [];
	for (let i = 0; i < amountOfIdArrays; i++) {
		const start = i * lengthOfIds;
		const end = Math.min((i + 1) * lengthOfIds, totalRecords);
		ranges.push({ start, end });
	}
	return ranges;
};
