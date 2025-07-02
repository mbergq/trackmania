import { createFileRoute } from "@tanstack/react-router";
import { cookie } from "@/server/cookie";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/auth/")({
	component: RouteComponent,
});

function RouteComponent() {
	const cookieFn = useServerFn(cookie);

	return (
		<div>
			<button
				type="button"
				onClick={() =>
					cookieFn({
						data: {
							username: "martin",
						},
					})
				}
			>
				Test me
			</button>
			Hello "/auth/"!
		</div>
	);
}
