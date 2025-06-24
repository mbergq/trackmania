import { formatTime } from "@/lib/utils/client-utils";
import type { getMapRecordsFn } from "@/server/getMapRecords";
import { Route, useNavigate } from "@tanstack/react-router";
import { use } from "react";
import authorMedal from "@/assets/medals/medal_author.png";
import goldMedal from "@/assets/medals/medal_gold.png";
import silverMedal from "@/assets/medals/medal_silver.png";
import bronzeMedal from "@/assets/medals/medal_bronze.png";
import { TrackmaniaText } from "./TrackmaniaText";

type Props = {
	mapPromise: ReturnType<typeof getMapRecordsFn>;
	currentPage: number;
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

export const MapModal: React.FC<Props> = ({ mapPromise, currentPage }) => {
	const map = use(mapPromise);
	const navigate = useNavigate({ from: "/records" });
	const mapRecord = map.records.responseData;
	const mapInfo = map.mapInfo.responseData;

	return (
		<div className="bg-gray-600 w-lg h-96 fixed left-154 rounded-lg shadow-lg text-white p-4 overflow-y-auto flex flex-col gap-y-2">
			<button
				type="button"
				className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded transition-colors duration-150 text-tm-green w-fit self-start"
				onClick={() =>
					navigate({ search: { mapId: undefined, page: currentPage } })
				}
			>
				X
			</button>
			<div className="flex flex-row items-center gap-x-2">
				<img
					className="w-56 h-36 object-cover rounded shadow-md"
					src={mapInfo.thumbnailUrl}
					alt="thumbnail"
				/>
				<TrackmaniaText letters={mapInfo.name} />
			</div>
			{mapRecord?.map((x) => (
				<div
					key={x.mapId}
					className="flex flex-row gap-x-2 gap-y-1 bg-gray-800 rounded p-3 mb-2"
				>
					<p className="font-mono">Your PB: {formatTime(x.recordScore.time)}</p>
					{calculatePb(
						x.recordScore.time,
						mapInfo.bronzeScore,
						mapInfo.silverScore,
						mapInfo.goldScore,
						mapInfo.authorScore,
					)}
					{/* <p className="text-sm text-gray-300">
						Record driven: {new Date(x.timestamp).toLocaleString()}
					</p> */}
				</div>
			))}
		</div>
	);
};
