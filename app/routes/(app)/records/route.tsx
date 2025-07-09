import { formatTime } from "@/lib/utils/client-utils";
import { getMapRecordsFn } from "@/server/getMapRecords";
import { getMapsFn } from "@/server/getMaps";
import type { MapInfo } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	useReactTable,
	type FilterFn,
} from "@tanstack/react-table";
import { type RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import authorMedal from "@/assets/medals/medal_author.png";
import goldMedal from "@/assets/medals/medal_gold.png";
import silverMedal from "@/assets/medals/medal_silver.png";
import bronzeMedal from "@/assets/medals/medal_bronze.png";
import { MapModal } from "@/components/MapModal";
import { TrackmaniaText } from "@/components/TrackmaniaText";
import { Suspense, useEffect, useState } from "react";
import { z } from "zod";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/(app)/records")({
	validateSearch: z.object({
		page: z.number().default(1),
		mapId: z.string().optional(),
	}),
	loaderDeps: ({ search }) => ({ mapId: search.mapId, page: search.page }),
	pendingComponent: () => {
		return (
			<div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md z-50">
				<Loader className="animate-spin text-tm-green" />
				<span>Please wait a moment while we're collecting data..</span>
			</div>
		);
	},
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
declare module "@tanstack/react-table" {
	//add fuzzy filter to the filterFns
	interface FilterFns {
		fuzzy: FilterFn<unknown>;
	}
	interface FilterMeta {
		itemRank: RankingInfo;
	}
}

const fuzzyFilter: FilterFn<boolean> = (row, _columnId, value, addMeta) => {
	const itemRank = rankItem(row.getValue("filename"), value);
	addMeta({ itemRank });
	return itemRank.passed;
};

function RouteComponent() {
	const { maps: data, mapPromise } = Route.useLoaderData();
	const { mapId, page } = Route.useSearch({
		select: (search) => ({ mapId: search.mapId, page: search.page }),
		structuralSharing: true,
	});

	const [globalFilter, setGlobalFilter] = useState("");

	const [pagination, setPagination] = useState({
		pageIndex: page - 1,
		pageSize: 10,
	});

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
		columnHelper.accessor("filename", {
			id: "filename",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("thumbnailUrl", {
			cell: (info) => (
				<img
					className="w-48 h-36 object-cover rounded shadow-md"
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
						return <TrackmaniaText letters={info.getValue()} />;
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

	const fallbackData: MapInfo[] = [
		{
			author: "No author available",
			authorScore: 0,
			bronzeScore: 0,
			collectionName: "",
			createdWithGamepadEditor: false,
			createdWithSimpleEditor: false,
			fileUrl: "",
			filename: "No records available",
			goldScore: 0,
			isPlayable: false,
			mapId: "",
			mapStyle: "",
			mapType: "",
			mapUid: "",
			name: "No records available",
			silverScore: 0,
			submitter: "",
			thumbnailUrl: "https://via.placeholder.com/192x144?text=No+Image",
			timestamp: 0,
		},
	];

	const table = useReactTable({
		columns,
		data: data ?? fallbackData,
		filterFns: {
			fuzzy: fuzzyFilter,
		},
		globalFilterFn: "fuzzy",
		getFilteredRowModel: getFilteredRowModel(),
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			pagination,
			globalFilter,
			columnVisibility: {
				filename: false,
			},
		},
	});

	return (
		<div className="text-white p-4">
			<div className="mt-4 flex items-center justify-around font-mono mb-1">
				<div className="flex items-center gap-x-4">
					<span className="text-sm w-40">
						Page {page} of {table.getPageCount()}
					</span>
					<DebouncedInput
						value={globalFilter}
						onChange={(value) => setGlobalFilter(String(value))}
						placeholder="Search by map name..."
					/>
				</div>

				<div className="flex gap-x-1">
					<Button
						content="Previous"
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
						className="bg-tm-grey cursor-pointer"
					>
						Previous
					</Button>
					<Button
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
						className="bg-tm-grey cursor-pointer"
					>
						Next
					</Button>
				</div>
			</div>
			{mapPromise && (
				<Suspense
					fallback={
						<div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md z-50">
							<Loader className="animate-spin text-tm-green" />
						</div>
					}
				>
					<MapModal mapPromise={mapPromise} currentPage={page} />
				</Suspense>
			)}
			<div className="rounded-lg shadow-lg">
				<table className="bg-tm-grey w-full border-collapse">
					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id} className="border-b-2 border-background-blue">
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id} className="px-4 py-2">
										<button
											type="button"
											className="w-full h-full text-left cursor-pointer p-2"
											onClick={() => {
												if (cell.row.original.mapId === mapId) {
													return;
												}
												navigate({
													search: {
														page: page,
														mapId: cell.row.original.mapId,
													},
													resetScroll: false,
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

function DebouncedInput({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}: {
	value: string | number;
	onChange: (value: string | number) => void;
	debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	useEffect(() => {
		const timeout = window.setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [value, debounce, onChange]);

	return (
		<Input
			{...props}
			value={value}
			onChange={(e) => setValue(e.target.value)}
			className="bg-tm-grey border-none"
		/>
	);
}
