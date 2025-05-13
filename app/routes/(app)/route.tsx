import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<header className="bg-background-white">
				<nav>
					<Link to="/">Home</Link>
					<Link to="/records">Records</Link>
				</nav>
			</header>
			<div className="flex flex-row h-dvh">
				<Outlet />
			</div>
		</>
	);
}
