import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { fetchMapFn } from "@/server/fetchMaps";
import { fetchTestFn } from "@/server/fetchTest";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/(app)/")({
	component: RouteComponent,
	// beforeLoad
	loader: async () => {
		const data = await fetchMapFn();
		return data;
	},
});

function RouteComponent() {
	// const data = Route.useLoaderData();
	const fetchTest = useServerFn(fetchTestFn);
	return (
		<div>
			Hello "/(app)/"!
			<button type="button" onClick={() => fetchTest()}>
				Click me
			</button>
		</div>
	);
}
