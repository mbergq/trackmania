type Records = {
	accountId: string;
	fileName: string;
	gameMode: string;
	gameModeCustomData: string;
	mapId: string;
	mapRecordId: string;
	medal: number;
	recordScore: { respawnCount: number; score: number; time: number };
	removed: boolean;
	scopeId: null;
	scopeType: string;
	timestamp: Date;
	url: string;
}[];

type DBMapsInfo = {
	author: string;
	author_score: number;
	bronze_score: number;
	collection_name: string;
	created_with_gamepad_editor: boolean;
	created_with_simple_editor: boolean;
	file_url: string;
	filename: string;
	gold_score: number;
	is_playable: boolean;
	map_id: string;
	map_style: string;
	map_type: string;
	map_uid: string;
	name: string;
	silver_score: number;
	submitter: string;
	thumbnail_url: string;
	timestamp: number;
}[];

type MapsInfo = {
	author: string;
	authorScore: number;
	bronzeScore: number;
	collectionName: string;
	createdWithGamepadEditor: boolean;
	createdWithSimpleEditor: boolean;
	fileUrl: string;
	filename: string;
	goldScore: number;
	isPlayable: boolean;
	mapId: string;
	mapStyle: string;
	mapType: string;
	mapUid: string;
	name: string;
	silverScore: number;
	submitter: string;
	thumbnailUrl: string;
	timestamp: Date;
}[];

// Used for client when creating table with TanStack Table
type MapInfo = {
	author: string;
	authorScore: number;
	bronzeScore: number;
	collectionName: string;
	createdWithGamepadEditor: boolean;
	createdWithSimpleEditor: boolean;
	fileUrl: string;
	filename: string;
	goldScore: number;
	isPlayable: boolean;
	mapId: string;
	mapStyle: string;
	mapType: string;
	mapUid: string;
	name: string;
	silverScore: number;
	submitter: string;
	thumbnailUrl: string;
	timestamp: number;
};

export type { Records, MapsInfo, DBMapsInfo, MapInfo };
