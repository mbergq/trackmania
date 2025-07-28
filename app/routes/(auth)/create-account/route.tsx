import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createAccountFn } from "@/server/createAccount";
import { useServerFn } from "@tanstack/react-start";
import { Input } from "@/components/ui/input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState } from "react";

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
		.refine((val) => /[!@#$%^&*(),.?\":{}|<>]/.test(val), {
			message: "Password must contain at least one special character",
		}),
});

type Inputs = z.infer<typeof schema>;

export const Route = createFileRoute("/(auth)/create-account")({
	component: RouteComponent,
});

function RouteComponent() {
	const createAccount = useServerFn(createAccountFn);
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({ resolver: zodResolver(schema) });

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		const res = await createAccount({ data });
		if (res.success) {
			navigate({ to: "/login" });
		} else {
			setErrorMessage(res.error || "An unknown error occurred");
		}
	};

	return (
		<div className="flex justify-center items-center h-dvh">
			<form
				className="flex flex-col gap-y-2 w-[288px]"
				onSubmit={handleSubmit(onSubmit)}
			>
				<span className="text-white font-mono">Choose a username</span>
				<Input
					className="border-gray-800 bg-gray-700 text-tm-green"
					placeholder="Username.."
					{...register("username")}
					required
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
					required
				/>
				{errors.password && (
					<p className="text-red-500 font-mono text-sm">
						{errors.password.message}
					</p>
				)}
				{errorMessage && (
					<span className="text-red-500 font-mono text-sm">{errorMessage}</span>
				)}
				<button type="submit" className="hidden">
					Send
				</button>
			</form>
		</div>
	);
}
