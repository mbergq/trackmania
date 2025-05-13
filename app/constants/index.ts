import { createTrackmaniaClient } from "@/lib/trackmania";

const accountId = process.env.ACCOUNT_ID ?? "";

const { tmCoreClient } = createTrackmaniaClient("NadeoServices");
const { tmLiveMeetClient } = createTrackmaniaClient("NadeoLiveServices");

export { accountId, tmCoreClient, tmLiveMeetClient };
