import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/(app)/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(app)/"!</div>;
}
