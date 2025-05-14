import { getMapInfoFn } from "@/server/getMapInfo";
import { getRecordsFn } from "@/server/getRecords";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

export const Route = createFileRoute("/(app)/records")({
	component: RouteComponent,
	loader: async () => {
		const data = await getRecordsFn();
		return { data };
	},
});

type Record = {
	accountId: string;
	fileName: string;
	gameMode: string;
	gameModeCustomData: string;
	mapId: string;
	mapRecordId: string;
	medal: number;
	recordScore: {
		respawnCount: number;
		score: number;
		time: number;
	};
	removed: boolean;
	scopeId: null;
	scopeType: string;
	timestamp: Date;
	url: string;
};

function RouteComponent() {
	const { data } = Route.useLoaderData();
	const getMapInfo = useServerFn(getMapInfoFn);
	const columnHelper = createColumnHelper<Record>();

	const columns = [
		columnHelper.accessor("accountId", {
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id,
		}),
		columnHelper.accessor("mapId", {
			header: () => "MapId:",
			cell: (info) => info.renderValue(),
			footer: (info) => info.column.id,
		}),
		columnHelper.accessor("gameMode", {
			header: () => <span>Game mode</span>,
			footer: (info) => info.column.id,
		}),
		columnHelper.accessor("recordScore", {
			header: "Record score",
			footer: (info) => info.column.id,
		}),
		columnHelper.accessor("removed", {
			header: "Removed",
			footer: (info) => info.column.id,
		}),
	];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div>
			Hello "/(app)/records"!
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
				<tfoot>
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
				</tfoot>
			</table>
		</div>
	);
}
