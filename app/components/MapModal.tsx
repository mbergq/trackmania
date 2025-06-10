import { formatTime } from "@/lib/utils/client-utils";
import type { getMapRecordsFn } from "@/server/getMapRecords";
import { useNavigate } from "@tanstack/react-router";
import { use } from "react";

type Props = {
	mapPromise: ReturnType<typeof getMapRecordsFn>;
};

export const MapModal: React.FC<Props> = ({ mapPromise }) => {
	const map = use(mapPromise);
	const navigate = useNavigate({ from: "/records" });
	const mapRecord = map.records.responseData;
	const mapInfo = map.mapInfo.responseData;

	return (
		<div className="bg-background-blue w-full h-96 fixed left-154">
			<button
				type="button"
				onClick={() => navigate({ search: { mapId: undefined, page: 1 } })}
			>
				Close
			</button>
			{mapRecord?.map((x) => (
				<div key={x.mapId}>
					<p>Your PB:{formatTime(x.recordScore.time)}</p>
					<p>Record driven: {new Date(x.timestamp).toLocaleString()}</p>
				</div>
			))}
		</div>
	);
};
