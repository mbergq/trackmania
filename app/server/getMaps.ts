import { tmCoreClient } from "@/constants";
import { db } from "@/lib/db";
import {
	getRanges,
	insertMapsIntoDatabase,
	reformatIds,
} from "@/lib/utils/server-utils";
import type { DBMapsInfo } from "@/types";
import { createServerFn } from "@tanstack/react-start";

export const getMapsFn = createServerFn({ method: "GET" }).handler(async () => {
	const queryAllMaps = () =>
		db
			.query(`
				SELECT
					author,
					author_score,
					bronze_score,
					collection_name,
					created_with_gamepad_editor,
					created_with_simple_editor,
					file_url,
					filename,
					gold_score,
					is_playable,
					map_id,
					map_style,
					map_type,
					map_uid,
					name,
					silver_score,
					submitter,
					thumbnail_url,
					timestamp,
					created_at
				FROM maps
			`)
			.all() as DBMapsInfo;

	const mapRowsToCamel = (rows: DBMapsInfo) =>
		rows.map((x) => ({
			author: x.author,
			authorScore: x.author_score,
			bronzeScore: x.bronze_score,
			collectionName: x.collection_name,
			createdWithGamepadEditor: x.created_with_gamepad_editor,
			createdWithSimpleEditor: x.created_with_simple_editor,
			fileUrl: x.file_url,
			filename: x.filename,
			goldScore: x.gold_score,
			isPlayable: x.is_playable,
			mapId: x.map_id,
			mapStyle: x.map_style,
			mapType: x.map_type,
			mapUid: x.map_uid,
			name: x.name,
			silverScore: x.silver_score,
			submitter: x.submitter,
			thumbnailUrl: x.thumbnail_url,
			timestamp: new Date(x.timestamp * 1000).toLocaleString("sv", {
				dateStyle: "short",
				timeStyle: "short",
			}) as unknown as number,
		}));

	let rows = queryAllMaps();

	const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

	const updateDB = async () => {
		const { responseData } = await tmCoreClient.getRecords();
		const mapIds: string[] = responseData.map((x) => x.mapId);
		const ranges = getRanges(responseData.length, 200);
		for (const range of ranges) {
			const mapIdList = reformatIds(mapIds, range.start, range.end);
			const mapsInfo = await tmCoreClient.getMapsInfo(mapIdList);
			insertMapsIntoDatabase(mapsInfo.responseData);
		}
		// Re-query the database after inserts so we return up-to-date rows
		rows = queryAllMaps();
		return mapRowsToCamel(rows);
	};

	// If there is no data stored in the DB, insert all data first and then return it
	if (rows.length === 0) {
		console.log("--- No data found, fetching and inserting");
		return updateDB();
	}

	// If database has not been updated for over a week, fetch and insert new records
	if (rows.length !== 0 && new Date(`${rows[0].created_at}Z`) <= sevenDaysAgo) {
		console.log(
			"--- Seven days since database was last updated, fetching and inserting new data...",
		);
		return updateDB();
	}

	return mapRowsToCamel(rows);
});
