import { db } from "@/lib/db";
import type { DBMapsInfo } from "@/types";
import { createServerFn } from "@tanstack/react-start";

export const getMapsInfoFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const res = db
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
				timestamp
			FROM maps
		`)
			.all() as DBMapsInfo;

		const data = res.map((x) => ({
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
			timestamp: x.timestamp,
		}));

		console.log(data);
		return data;
	},
);
