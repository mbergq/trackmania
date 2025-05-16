import { storeMapsFn } from "@/script/storeMaps";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/(app)/")({
	component: RouteComponent,
});

function RouteComponent() {
	const storeMaps = useServerFn(storeMapsFn);
	return (
		<div>
			Hello "/(app)/"!
			<button type="button" onClick={() => storeMaps()}>
				Request API and store maps
			</button>
		</div>
	);
}
