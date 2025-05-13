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

export type { Records };
