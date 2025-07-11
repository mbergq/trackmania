import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
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
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState } from "react";
import tmCar from "@/assets/tm-car.svg";
import { getUsernameFn } from "@/server/getUsername";

const schema = z.object({
	username: z
		.string()
		.min(1, "Username is required")
		.regex(/^[a-zA-Z]+$/, "Username must contain only letters"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.refine((val) => /[A-Z]/.test(val), {
			message: "Password must contain at least one uppercase letter",
		})
		.refine((val) => /[a-z]/.test(val), {
			message: "Password must contain at least one lowercase letter",
		})
		.refine((val) => /\d/.test(val), {
			message: "Password must contain at least one number",
		})
		.refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
			message: "Password must contain at least one special character",
		}),
	passcode: z
		.string()
		.length(8, "Passcode must be exactly 8 digits")
		.regex(/^\d+$/, "Passcode must contain only digits"),
});

type Inputs = z.infer<typeof schema>;

export const Route = createFileRoute("/(auth)/login")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (context.isAuth) {
			throw redirect({ to: "/" });
		}
	},
	loader: async () => {
		const username = await getUsernameFn();
		return username;
	},
});

function RouteComponent() {
	const setSession = useServerFn(setSessionFn);
	const [showCar, setShowCar] = useState(false);
	const navigate = useNavigate();
	const data = Route.useLoaderData();
	const { username } = data;
	const [defaultUsername, setDefaultUsername] = useState(username);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const triggerAnimation = () => {
		setShowCar(true);
		setTimeout(() => setShowCar(false), 1000);
	};

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<Inputs>({ resolver: zodResolver(schema) });
	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		const { username, password, passcode } = data;
		const res = await setSession({
			data: {
				username: username,
				password: password,
				passcode: passcode,
			},
		});
		if (res.success) {
			triggerAnimation();
			setTimeout(() => {
				navigate({ to: "/" });
			}, 1000);
		} else {
			setErrorMessage(res.error || "An unknown error occurred");
		}
	};

	return (
		<div className="flex justify-center items-center h-dvh">
			<form className="flex flex-col gap-y-2" onSubmit={handleSubmit(onSubmit)}>
				{defaultUsername ? (
					<span className="text-white font-mono italic">
						Hello {defaultUsername}
					</span>
				) : (
					<span className="text-white font-mono">Who are you then?</span>
				)}
				<Input
					className="border-gray-800 bg-gray-700 text-tm-green"
					placeholder="Username.."
					defaultValue={defaultUsername}
					{...register("username")}
					required={true}
					onChange={() => setDefaultUsername("")}
				/>
				{errors.username && (
					<p className="text-red-500 font-mono text-sm">
						{errors.username.message}
					</p>
				)}
				<span className="text-white font-mono">Password</span>
				<Input
					type="password"
					className="border-gray-800 bg-gray-700 text-tm-green"
					placeholder="Password.."
					{...register("password")}
					required={true}
				/>
				{errors.password && (
					<p className="text-red-500 font-mono text-sm">
						{errors.password.message}
					</p>
				)}
				{errorMessage && (
					<span className="text-red-500 font-mono text-sm">{errorMessage}</span>
				)}
				<span className="text-white font-mono">Passcode</span>
				<Controller
					name="passcode"
					control={control}
					render={({ field }) => (
						<InputOTP
							maxLength={8}
							pattern={REGEXP_ONLY_DIGITS}
							value={field.value}
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
				<button type="submit" className="hidden">
					Send
				</button>
			</form>
			{showCar && (
				<div className="fixed -translate-x-[122px] translate-y-[102px] pointer-events-none select-none">
					<img
						src={tmCar}
						alt="Trackmania stadium car model"
						className="w-12 h-12 animate-slide-fade"
					/>
				</div>
			)}
		</div>
	);
}
