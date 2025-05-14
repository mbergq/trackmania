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

export type { Records, MapsInfo };
