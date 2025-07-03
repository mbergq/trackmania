import { createFileRoute, redirect } from "@tanstack/react-router";
import { setSessionFn } from "@/server/setSession";
import { useServerFn } from "@tanstack/react-start";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";

type Inputs = {
	username: string;
	passcode: number;
};

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
		<div className="flex justify-center items-center h-dvh">
			<form className="flex flex-col gap-y-2">
				<span className="text-white font-mono">What can we call you?</span>
				<Input
					className="border-gray-800 bg-gray-700 text-tm-green"
					placeholder="Username.."
				/>
				<span className="text-white font-mono">Passcode</span>
				<InputOTP maxLength={8}>
					<InputOTPGroup className="text-tm-green font-mono">
						<InputOTPSlot index={0} />
						<InputOTPSlot index={1} />
						<InputOTPSlot index={2} />
						<InputOTPSlot index={3} />
						<InputOTPSlot index={4} />
						<InputOTPSlot index={5} />
						<InputOTPSlot index={6} />
						<InputOTPSlot index={7} />
					</InputOTPGroup>
				</InputOTP>
			</form>
		</div>
	);
}

/* <button
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
</button> */
