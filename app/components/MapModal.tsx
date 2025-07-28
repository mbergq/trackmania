import { formatTime } from "@/lib/utils/client-utils";
import type { getMapRecordsFn } from "@/server/getMapRecords";
import { Route, useNavigate } from "@tanstack/react-router";
import { use } from "react";
import authorMedal from "@/assets/medals/medal_author.png";
import goldMedal from "@/assets/medals/medal_gold.png";
import silverMedal from "@/assets/medals/medal_silver.png";
import bronzeMedal from "@/assets/medals/medal_bronze.png";
import { TrackmaniaText } from "./TrackmaniaText";
import { SquareX } from "lucide-react";
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
	const getMedal = () => {
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
		return undefined;
	};

	return (
		<div>
			{getMedal() && (
				<img className="w-6 h-6" src={getMedal()} alt="medal logo" />
			)}
			{!getMedal() && <span className="text-gray-500">No medal</span>}
		</div>
	);
};

export const MapModal: React.FC<Props> = ({ mapPromise, currentPage }) => {
	const map = use(mapPromise);
	const navigate = useNavigate({ from: "/records" });
	const mapRecord = map.records.responseData;
	const mapInfo = map.mapInfo.responseData;

	return (
		<div className="w-lg bg-tm-grey shadow-2xl h-96 fixed left-154 rounded-lg p-4 overflow-y-auto flex flex-col gap-y-2 border border-gray-400">
			<SquareX
				onClick={() =>
					navigate({
						search: { mapId: undefined, page: currentPage },
						resetScroll: false,
					})
				}
				className="cursor-pointer text-gray-200"
			/>
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
					className="flex flex-row gap-x-2 gap-y-1 bg-gray-900 rounded p-3 mb-2"
				>
					<span className="font-mono">
						Your PB: {formatTime(x.recordScore.time)}
					</span>
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
