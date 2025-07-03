import { createTrackmaniaClient } from "@/lib/trackmania";

const ACCOUNT_ID = process.env.ACCOUNT_ID ?? "";
const PASSCODE = process.env.PASSCODE ?? "";

const { tmCoreClient } = createTrackmaniaClient("NadeoServices");
const { tmLiveMeetClient } = createTrackmaniaClient("NadeoLiveServices");

export { ACCOUNT_ID, PASSCODE, tmCoreClient, tmLiveMeetClient };
