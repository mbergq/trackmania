import { createFileRoute, redirect } from "@tanstack/react-router";
import { setSessionFn } from "@/server/setSession";
import { useServerFn } from "@tanstack/react-start";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";

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
	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors },
	} = useForm<Inputs>();
	const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

	return (
		<div className="flex justify-center items-center h-dvh">
			<form className="flex flex-col gap-y-2" onSubmit={handleSubmit(onSubmit)}>
				<span className="text-white font-mono">Who are you then?</span>
				<Input
					className="border-gray-800 bg-gray-700 text-tm-green"
					placeholder="Username.."
					{...register("username")}
					required={true}
				/>
				<span className="text-white font-mono">Passcode</span>
				<Controller
					name="passcode"
					control={control}
					render={({ field }) => (
						<InputOTP
							maxLength={8}
							pattern={REGEXP_ONLY_DIGITS}
							value={field.value?.toString()}
							onChange={field.onChange}
							onBlur={field.onBlur}
							ref={field.ref}
						>
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
					)}
				/>
				<button type="submit">Click</button>
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
