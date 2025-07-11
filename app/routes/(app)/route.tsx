import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
} from "@tanstack/react-router";

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";

export const Route = createFileRoute("/(app)")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (!context.isAuth) {
			throw redirect({ to: "/login" });
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
					<h1 className="text-2xl text-center font-extrabold mb-2">
						Trackmania
					</h1>
					<nav className="flex justify-center gap-x-4 font-mono">
						<NavigationMenu>
							<NavigationMenuList>
								<NavigationMenuItem>
									<NavigationMenuLink asChild>
										<Link
											to="/"
											className="bg-tm-grey border px-4 py-2 rounded-md inline-block"
										>
											Home
										</Link>
									</NavigationMenuLink>
								</NavigationMenuItem>

								<NavigationMenuItem>
									<NavigationMenuLink asChild>
										<Link
											to="/records"
											className="bg-tm-grey border px-4 py-2 rounded-md inline-block"
										>
											Records
										</Link>
									</NavigationMenuLink>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenu>
					</nav>
				</div>
			</header>
			<main>
				<Outlet />
			</main>
		</div>
	);
}
