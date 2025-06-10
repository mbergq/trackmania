import { createTrackmaniaClient } from "@/lib/trackmania";

const ACCOUNT_ID = process.env.ACCOUNT_ID ?? "";

const { tmCoreClient } = createTrackmaniaClient("NadeoServices");
const { tmLiveMeetClient } = createTrackmaniaClient("NadeoLiveServices");

export { ACCOUNT_ID, tmCoreClient, tmLiveMeetClient };
