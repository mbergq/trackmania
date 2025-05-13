import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { getRecordsFn } from "@/server/getRecords";
import { useServerFn } from "@tanstack/react-start";
import { getMapInfoFn } from "@/server/getMapInfo";

export const Route = createFileRoute("/(app)/")({
	component: RouteComponent,
	loader: async () => {
		const records = await getRecordsFn();
		return { records };
	},
});

function RouteComponent() {
	const { records } = Route.useLoaderData();
	const getMapInfo = useServerFn(getMapInfoFn);
	// console.log(records);
	return (
		<div>
			Hello "/(app)/"!
			{records?.map((record) => (
				<button
					type="button"
					key={record.mapId}
					onClick={() => getMapInfo({ data: { mapId: record.mapId } })}
				>
					<p>{record.mapId}</p>
				</button>
			))}
		</div>
	);
}
