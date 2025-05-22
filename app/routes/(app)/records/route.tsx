import { formatTime, parseTrackmaniaStyledText } from "@/lib/client-utils";
import { getMapRecordsFn } from "@/server/getMapRecords";
import { getMapsFn } from "@/server/getMaps";
import type { MapRecords, MapInfo } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
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
import { useState } from "react";

export const Route = createFileRoute("/(app)/records")({
	component: RouteComponent,
	loader: async () => {
		const data = await getMapsFn();
		return { data };
	},
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
	const { data } = Route.useLoaderData();
	const getMapRecords = useServerFn(getMapRecordsFn);
	const columnHelper = createColumnHelper<MapInfo>();
	const [modalIsVisible, setModalIsVisible] = useState(false);
	const [mapData, setMapData] = useState<MapModalData | null>(null);

	const getSetMapData = async (
		mapId: string,
		{
			authorScore,
			goldScore,
			silverScore,
			bronzeScore,
		}: {
			authorScore: number;
			goldScore: number;
			silverScore: number;
			bronzeScore: number;
		},
	) => {
		const { responseData } = await getMapRecords({
			data: {
				mapId: mapId,
			},
		});
		const dataToSet: MapModalData = {
			records: responseData,
			referenceMedals: {
				author: {
					time: authorScore,
				},
				gold: {
					time: goldScore,
				},
				bronze: {
					time: bronzeScore,
				},
				silver: {
					time: silverScore,
				},
			},
		};
		setMapData(dataToSet);
	};

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
	});

	return (
		<div className="text-white p-4">
			<div className="mt-4 flex items-center justify-between font-mono">
				<div className="flex gap-x-2 items-center">
					<span className="text-sm">
						Page {table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</span>
				</div>

				<div className="flex gap-x-2">
					<button
						type="button"
						className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors duration-150 text-tm-green"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</button>
					<button
						type="button"
						className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors duration-150 text-tm-green"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</button>
				</div>
			</div>
			{modalIsVisible && (
				<MapModal data={mapData} setModalIsVisible={setModalIsVisible} />
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
												setModalIsVisible(!modalIsVisible);
												getSetMapData(cell.row.original.mapId, {
													authorScore: cell.row.original.authorScore,
													goldScore: cell.row.original.goldScore,
													silverScore: cell.row.original.silverScore,
													bronzeScore: cell.row.original.bronzeScore,
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
