import { createFileRoute } from "@tanstack/react-router";
import { fetchMapsFn } from "@/server/fetchMaps";
import { useServerFn } from "@tanstack/react-start";
export const Route = createFileRoute("/(app)/")({
	component: RouteComponent,
	// beforeLoad
	loader: ({ context }) => {},
});

function RouteComponent() {
	return <div>Hello "/(app)/"!</div>;
}
