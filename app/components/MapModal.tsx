import { formatTime } from "@/lib/utils/client-utils";
import type { getMapRecordsFn } from "@/server/getMapRecords";
import { useNavigate } from "@tanstack/react-router";
import { use } from "react";
import authorMedal from "@/assets/medals/medal_author.png";
import goldMedal from "@/assets/medals/medal_gold.png";
import silverMedal from "@/assets/medals/medal_silver.png";
import bronzeMedal from "@/assets/medals/medal_bronze.png";

type Props = {
	mapPromise: ReturnType<typeof getMapRecordsFn>;
};

const calculatePb = (
	pb: number,
	bronze: number,
	silver: number,
	gold: number,
	author: number,
) => {
	const medal = () => {
		if (pb <= author) {
			return authorMedal;
		}
		if (pb <= gold) {
			return goldMedal;
		}
		if (pb <= silver) {
			return silverMedal;
		}
		if (pb <= bronze) {
			return bronzeMedal;
		}
		return "No medal";
	};

	return (
		<div>
			<img className="w-6 h-6" src={medal()} alt="medal logo" />
		</div>
	);
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
					{calculatePb(
						x.recordScore.time,
						mapInfo.bronzeScore,
						mapInfo.silverScore,
						mapInfo.goldScore,
						mapInfo.authorScore,
					)}
				</div>
			))}
		</div>
	);
};
