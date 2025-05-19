import { formatTime, parseTrackmaniaStyledText } from "@/lib/client-utils";
import { getMapInfoFn } from "@/server/getMapInfo";
import { getMapsInfoFn } from "@/server/getMapsinfo";
import type { MapInfo } from "@/types";
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

export const Route = createFileRoute("/(app)/records")({
	component: RouteComponent,
	loader: async () => {
		const data = await getMapsInfoFn();
		return { data };
	},
});

function RouteComponent() {
	const { data } = Route.useLoaderData();
	const getMapInfo = useServerFn(getMapInfoFn);
	const columnHelper = createColumnHelper<MapInfo>();

	const createMedalAccessor = (
		accessorKey: "authorScore" | "goldScore" | "silverScore" | "bronzeScore",
		medalImg: string,
		medalAlt: string,
	) => {
		return columnHelper.accessor(accessorKey, {
			cell: (info) => (
				<div className="flex flex-row items-center gap-x-1">
					<img className="w-6 h-6" src={medalImg} alt={medalAlt} />
					{formatTime(info.getValue())}
				</div>
			),
		});
	};

	const columns = [
		columnHelper.accessor("thumbnailUrl", {
			cell: (info) => (
				<img className="w-28 h-28" src={info.getValue()} alt="thumbnail" />
			),
		}),
		columnHelper.group({
			id: "Name",
			header: () => <span>Name</span>,
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
			header: () => <span>Medals</span>,
			columns: [
				createMedalAccessor("authorScore", authorMedal, "Author"),
				createMedalAccessor("goldScore", goldMedal, "Gold"),
				createMedalAccessor("silverScore", silverMedal, "Silver"),
				createMedalAccessor("bronzeScore", bronzeMedal, "Bronze"),
			],
		}),
		columnHelper.accessor("timestamp", {
			cell: (info) => new Date(info.getValue() * 1000).toLocaleString(),
		}),
	];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div>
			<button
				type="button"
				onClick={async () => {
					table.previousPage();
				}}
			>
				Previous
			</button>
			<button
				type="button"
				onClick={async () => {
					table.nextPage();
				}}
			>
				Next
			</button>
			<div className="p-2 border">
				<table>
					<thead className="border">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th key={header.id} className="border">
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id} className="border border-tm-white">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
				<div className="h-4" />
			</div>
		</div>
	);
}
