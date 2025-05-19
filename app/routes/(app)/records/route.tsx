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
				columnHelper.accessor("authorScore", {
					cell: (info) => formatTime(info.getValue()),
				}),
				columnHelper.accessor("goldScore", {
					cell: (info) => formatTime(info.getValue()),
				}),
				columnHelper.accessor("silverScore", {
					cell: (info) => formatTime(info.getValue()),
				}),
				columnHelper.accessor("bronzeScore", {
					cell: (info) => formatTime(info.getValue()),
				}),
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
			<div className="p-2">
				<table>
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th key={header.id}>
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
									<td key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
					{/* <tfoot>
						{table.getFooterGroups().map((footerGroup) => (
							<tr key={footerGroup.id}>
								{footerGroup.headers.map((header) => (
									<th key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.footer,
													header.getContext(),
												)}
									</th>
								))}
							</tr>
						))}
					</tfoot> */}
				</table>
				<div className="h-4" />
				{/* <button type="button" onClick={() => rerender()} className="border p-2">
					Rerender
				</button> */}
			</div>
		</div>
	);
}
