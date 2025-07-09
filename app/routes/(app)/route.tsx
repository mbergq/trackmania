import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/(app)")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (!context.isAuth) {
			throw redirect({ to: "/auth" });
		}

		return {
			...context,
		};
	},
	loader: ({ context }) => {
		return {
			user: context.username,
		};
	},
});

function RouteComponent() {
	return (
		<div className="h-dvh text-white">
			<header className="bg-tm-grey shadow-md">
				<div className="py-3">
					<h1 className="text-2xl font-bold text-center mb-3">Trackmania</h1>
					<nav className="flex justify-center gap-x-4">
						<Link
							to="/"
							className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors duration-150 text-tm-green font-medium"
						>
							Home
						</Link>
						<Link
							to="/records"
							className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors duration-150 text-tm-green font-medium"
						>
							Records
						</Link>
					</nav>
				</div>
			</header>
			<main>
				<Outlet />
			</main>
		</div>
	);
}
