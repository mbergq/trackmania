import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<h1 className="text-xl text-center">Trackmania</h1>
			<header className="bg-background-white">
				<nav>
					<Link to="/">Home</Link>
					<Link to="/records">Records</Link>
				</nav>
			</header>
			<div className="flex flex-col h-dvh">
				<Outlet />
			</div>
		</>
	);
}
