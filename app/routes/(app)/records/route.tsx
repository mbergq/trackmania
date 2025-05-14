import { getMapInfoFn } from "@/server/getMapInfo";
import { getMapsInfoFn } from "@/server/getMapsinfo";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/(app)/records")({
	component: RouteComponent,
	loader: async () => {
		const data = await getMapsInfoFn({
			data: {
				start: 0,
				end: 50,
			},
		});
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

type MapInfo = {
	author: string;
	authorScore: number;
	bronzeScore: number;
	collectionName: string;
	createdWithGamepadEditor: boolean;
	createdWithSimpleEditor: boolean;
	fileUrl: string;
	filename: string;
	goldScore: number;
	isPlayable: boolean;
	mapId: string;
	mapStyle: string;
	mapType: string;
	mapUid: string;
	name: string;
	silverScore: number;
	submitter: string;
	thumbnailUrl: string;
	timestamp: Date;
};

function RouteComponent() {
	const { data: initialData } = Route.useLoaderData();
	const [data, setData] = useState(initialData.maps.responseData);
	const getMapInfo = useServerFn(getMapInfoFn);
	const getMaps = useServerFn(getMapsInfoFn);

	const columnHelper = createColumnHelper<MapInfo>();
	const columns = [
		columnHelper.accessor("name", {
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id,
		}),
		columnHelper.accessor("authorScore", {
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id,
		}),
		columnHelper.accessor("thumbnailUrl", {
			cell: (info) => (
				<img className="w-20 h-20" alt="thumbnail" src={info.getValue()} />
			),
			footer: (info) => info.column.id,
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
			Hello "/(app)/records"!
			<button
				type="button"
				onClick={async () => {
					table.nextPage();
				}}
			>
				Next
			</button>
			<button
				type="button"
				onClick={async () => {
					table.previousPage();
				}}
			>
				Previous
			</button>
			<select
				value={table.getState().pagination.pageSize}
				onChange={(e) => {
					table.setPageSize(Number(e.target.value));
				}}
			>
				{[10, 20, 30, 40, 50].map((pageSize) => (
					<option key={pageSize} value={pageSize}>
						{pageSize}
					</option>
				))}
			</select>
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
