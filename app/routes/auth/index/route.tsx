import { createFileRoute, redirect } from "@tanstack/react-router";
import { setSessionFn } from "@/server/setSession";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/auth/")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (context.isAuth) {
			throw redirect({ to: "/" });
		}
	},
});

function RouteComponent() {
	const setSession = useServerFn(setSessionFn);

	return (
		<div>
			<button
				type="button"
				onClick={() =>
					setSession({
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
