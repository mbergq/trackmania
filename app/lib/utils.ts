import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const reformatIds = (ids: string[], start: number, end: number) => {
	return ids
		.slice(start, end)
		.map((id) => id)
		.join(",");
};
