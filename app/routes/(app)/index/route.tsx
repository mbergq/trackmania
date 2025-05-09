import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { fetchMapFn } from "@/server/fetchMaps";

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
	return <div>Hello "/(app)/"!</div>;
}
