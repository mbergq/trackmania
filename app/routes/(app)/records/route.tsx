import { getMapInfoFn } from "@/server/getMapInfo";
import { getRecordsFn } from "@/server/getRecords";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/(app)/records")({
	component: RouteComponent,
	loader: async () => {
		const records = await getRecordsFn();
		return { records };
	},
});

function RouteComponent() {
	const { records } = Route.useLoaderData();
	const getMapInfo = useServerFn(getMapInfoFn);

	return (
		<div>
			Hello "/(app)/records"!
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
