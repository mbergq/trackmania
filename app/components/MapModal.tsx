import type { MapModalData } from "@/routes/(app)/records/route";
import { formatTime } from "@/lib/client-utils";

type Props = {
	setModalIsVisible: (isVisible: boolean) => void;
	data: MapModalData | null;
};

export const MapModal: React.FC<Props> = ({ setModalIsVisible, data }) => {
	console.log(data?.records?.[0]);
	console.log(data?.referenceMedals);
	return (
		<div className="bg-background-blue w-full h-96 fixed left-154">
			<button type="button" onClick={() => setModalIsVisible(false)}>
				Close
			</button>
			{data?.records?.map((x) => (
				<div key={x.mapId}>
					<p>Your PB:{formatTime(x.recordScore.time)}</p>
					<p>Record driven: {new Date(x.timestamp).toLocaleString()}</p>
				</div>
			))}
		</div>
	);
};
