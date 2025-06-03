import { formatTime, parseTrackmaniaStyledText } from "@/lib/client-utils";
import { getMapRecordsFn } from "@/server/getMapRecords";
import { getMapsFn } from "@/server/getMaps";
import type { MapRecords, MapInfo } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import authorMedal from "@/assets/medals/medal_author.png";
import goldMedal from "@/assets/medals/medal_gold.png";
import silverMedal from "@/assets/medals/medal_silver.png";
import bronzeMedal from "@/assets/medals/medal_bronze.png";
import { MapModal } from "@/components/MapModal";
import { Suspense, useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/(app)/records")({
	validateSearch: z.object({
		page: z.number().default(1),
		mapId: z.string().optional(),
	}),
	loaderDeps: ({ search }) => ({ mapId: search.mapId, page: search.page }),
	loader: async ({ deps: { mapId, page } }) => {
		const maps = await getMapsFn();

		return {
			maps,
			...(mapId && {
				mapPromise: getMapRecordsFn({ data: { mapId } }),
				page: page,
			}),
		};
	},
	component: RouteComponent,
});

export type MapModalData = {
	records: MapRecords;
	referenceMedals: {
		author: {
			time: number;
		};
		gold: {
			time: number;
		};
		silver: {
			time: number;
		};
		bronze: {
			time: number;
		};
	};
};

function RouteComponent() {
	const { maps: data, mapPromise } = Route.useLoaderData();
	const { mapId, page } = Route.useSearch({
		select: (search) => ({ mapId: search.mapId, page: search.page }),
		structuralSharing: true,
	});
	const [pagination, setPagination] = useState({
		pageIndex: page -1,
		pageSize: 10,
	});
	console.log(pagination.pageIndex);

	const columnHelper = createColumnHelper<MapInfo>();
	const navigate = Route.useNavigate();

	const createMedalAccessor = (
		accessorKey: "authorScore" | "goldScore" | "silverScore" | "bronzeScore",
		medalImg: string,
		medalAlt: string,
	) => {
		return columnHelper.accessor(accessorKey, {
			cell: (info) => (
				<div className="flex flex-row items-center gap-x-2 px-2">
					<img className="w-6 h-6" src={medalImg} alt={medalAlt} />
					<span className="font-mono">{formatTime(info.getValue())}</span>
				</div>
			),
		});
	};

	const columns = [
		columnHelper.accessor("thumbnailUrl", {
			cell: (info) => (
				<img
					className="w-36 h-24 object-cover rounded shadow-md"
					src={info.getValue()}
					alt="thumbnail"
				/>
			),
		}),
		columnHelper.group({
			id: "Map",
			columns: [
				columnHelper.accessor("name", {
					cell: (info) => {
						const segments = parseTrackmaniaStyledText(info.getValue());
						return (
							<span>
								{segments.map((segment) => (
									<span
										key={segment.color + segment.text}
										style={{
											color: segment.color,
											fontWeight: segment.styles.bold ? "bold" : "normal",
											fontStyle: segment.styles.italic ? "italic" : "normal",
											fontStretch: segment.styles.wide
												? "expanded"
												: segment.styles.narrow
													? "condensed"
													: "normal",
											textShadow: segment.styles.shadow ? "" : "none",
											fontVariant: segment.styles.narrow
												? "small-caps"
												: "normal",
											textTransform: segment.styles.uppercase
												? "uppercase"
												: "none",
										}}
									>
										{segment.text}
									</span>
								))}
							</span>
						);
					},
				}),
			],
		}),
		columnHelper.group({
			id: "Medals",
			columns: [
				createMedalAccessor("authorScore", authorMedal, "Author"),
				createMedalAccessor("goldScore", goldMedal, "Gold"),
				createMedalAccessor("silverScore", silverMedal, "Silver"),
				createMedalAccessor("bronzeScore", bronzeMedal, "Bronze"),
			],
		}),
		columnHelper.accessor("timestamp", {
			cell: (info) => <span className="font-mono">{info.getValue()}</span>,
		}),
	];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			pagination,
		},
	});

	return (
		<div className="text-white p-4">
			<div className="mt-4 flex items-center justify-between font-mono">
				<div className="flex gap-x-2 items-center">
					<span className="text-sm">
						Page {page} of{" "}
						{table.getPageCount()}
					</span>
				</div>

				<div className="flex gap-x-2">
					<button
						type="button"
						className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors duration-150 text-tm-green"
						onClick={() => {
							setPagination({
								pageIndex: pagination.pageIndex - 1,
								pageSize: pagination.pageSize,
							});
							navigate({
								search: {
									page: page - 1,
								},
							});
						}}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</button>
					<button
						type="button"
						className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors duration-150 text-tm-green"
						onClick={() => {
							setPagination({
								pageIndex: pagination.pageIndex + 1,
								pageSize: pagination.pageSize,
							});
							navigate({
								search: {
									page: page + 1,
								},
							});
						}}
						disabled={!table.getCanNextPage()}
					>
						Next
					</button>
				</div>
			</div>
			{mapPromise && (
				<Suspense fallback={<div>Loading...</div>}>
					<MapModal mapPromise={mapPromise} />
				</Suspense>
			)}
			<div className="rounded-lg shadow-lg">
				<table className="bg-tm-grey w-full border-collapse">
					<tbody className="border-t border-gray-700">
						{table.getRowModel().rows.map((row) => (
							<tr
								key={row.id}
								className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-150"
							>
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id} className="px-4 py-2">
										<button
											type="button"
											className="w-full h-full text-left"
											onClick={() => {
												navigate({
													search: {
														page: page,
														mapId: cell.row.original.mapId,
													},
												});
											}}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</button>
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
