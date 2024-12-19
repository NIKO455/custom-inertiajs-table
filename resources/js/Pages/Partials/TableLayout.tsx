import React from "react";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    ArrowDown,
    ArrowRightCircle,
    ArrowUp,
    Ban,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ChevronsUpDown,
    CircleEqual,
    Clock,
    Columns2,
    EyeOff,
    MoreHorizontal,
    RefreshCw,
    TimerIcon,
    XCircle,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { router, Link } from "@inertiajs/react";
import { Payment } from "@/Pages/Welcome";

function TableLayout({
    data,
    makePermanent,
    actionButtons,
    actionButtonLinks,
    tableName,
}: {
    data: any;
    makePermanent: any;
    actionButtons: any;
    tableName: any;
    actionButtonLinks: any;
}) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const [pageIndex, setPageIndex] = React.useState(0);
    const [search, setSearch] = React.useState("");
    const [sort, setSort] = React.useState("");
    const [previousValues, setPreviousValues] = React.useState({});

    React.useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 700);

        return () => clearTimeout(timer);
    }, [rowsPerPage, pageIndex, search, sort]);

    const generateColumns = (data: any) => {
        const keys = Object.keys(data[0]);

        const columns: (null | {
            accessorKey: string;
            header: ({ column }: { column: any }) => React.JSX.Element;
            cell: ({ row }: { row: any }) => any;
        })[] = keys
            .map((key: string) => {
                if (key === "id") return null;

                return {
                    accessorKey: key,
                    header: ({ column }: { column: any }) => (
                        <div className={"flex justify-center"}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className={"w-8"}>
                                        <Button
                                            variant="ghost"
                                            className="h-full w-full border-1 p-0"
                                        >
                                            <span className="sr-only">
                                                Open menu
                                            </span>
                                            {key.charAt(0).toUpperCase() +
                                                key.slice(1)}
                                            <ChevronsUpDown />
                                        </Button>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="center"
                                    className={"mt-2"}
                                >
                                    <DropdownMenuItem
                                        onClick={() => setSort(`${column.id}`)}
                                    >
                                        <ArrowUp /> Asc
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setSort(`-${column.id}`)}
                                    >
                                        <ArrowDown /> Desc
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        disabled={makePermanent.includes(key)}
                                        onClick={() =>
                                            column.toggleVisibility(false)
                                        }
                                    >
                                        <EyeOff /> Hide
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ),
                    cell: ({ row }: { row: any }) => {
                        const value = row.getValue(key);
                        if (key === "amount") {
                            return new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                            }).format(value);
                        }

                        if (key === "status") {
                            let color: string;
                            let icon: any;

                            switch (value) {
                                case "verified":
                                    color = "text-gray-400";
                                    icon = <CheckCircle className="size-4" />;
                                    break;
                                case "pending":
                                    color = "text-gray-400";
                                    icon = <Clock className="size-4" />;
                                    break;
                                case "deleted":
                                    color = "text-gray-400";
                                    icon = <XCircle className="size-4" />;
                                    break;
                                case "active":
                                    color = "text-gray-400";
                                    icon = <CheckCircle className="size-4" />;
                                    break;
                                case "processing":
                                    color = "text-gray-400";
                                    icon = <RefreshCw className="size-4" />;
                                    break;
                                case "inactive":
                                    color = "text-gray-400";
                                    icon = (
                                        <CircleEqual className="size-4 rotate-90" />
                                    );
                                    break;
                                case "received":
                                    color = "text-gray-400";
                                    icon = (
                                        <ArrowRightCircle className="size-4" />
                                    );
                                    break;
                                case "approved":
                                    color = "text-gray-400";
                                    icon = <CheckCircle className="size-4" />;
                                    break;
                                case "blocked":
                                    color = "text-gray-400";
                                    icon = <Ban className="size-4" />;
                                    break;
                                case "expired":
                                    color = "text-gray-400";
                                    icon = <TimerIcon className="size-4" />;
                                    break;
                                default:
                                    color = "text-gray-400";
                                    icon = <XCircle className="size-4" />;
                            }

                            return (
                                <span
                                    className={`inline-flex items-center rounded px-2 py-0.5 font-medium gap-2`}
                                >
                                    <span className={`${color}`}>{icon}</span>
                                    {value}
                                </span>
                            );
                        }

                        return value;
                    },
                };
            })
            .filter(Boolean);

        const selectColumn: ColumnDef<Payment>[] = [
            {
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() &&
                                "indeterminate")
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(value)
                        }
                        aria-label="Select all"
                        className={"ml-3"}
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
        ];

        const actionColumn: ColumnDef<Payment>[] = [
            {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => {
                    const rowData = row.original;
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                            rowData.id,
                                        )
                                    }
                                >
                                    Copy {tableName} ID
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                { actionButtons.delete &&
                                    <Link href={actionButtonLinks.delete}>
                                        <DropdownMenuItem>
                                             Delete {tableName}
                                         </DropdownMenuItem>
                                    </Link>
                                }
                                { actionButtons.edit &&
                                    <Link href={actionButtonLinks.edit}>
                                        <DropdownMenuItem>
                                            Edit {tableName}
                                        </DropdownMenuItem>
                                    </Link>
                                }
                                { actionButtons.view &&
                                    <Link href={actionButtonLinks.view}>
                                        <DropdownMenuItem>
                                            View {tableName} details
                                        </DropdownMenuItem>
                                    </Link>
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ];

        return [...selectColumn, ...columns, ...actionColumn];
    };

    const fetchData = () => {
        let values = {};

        if (sort) {
            values.sort = sort;
        }

        if (search) {
            values.search = search;
        }

        if (pageIndex) {
            values.page = pageIndex + 1;
        }

        if (rowsPerPage !== 15) {
            values.perPage = rowsPerPage;
        }

        if (JSON.stringify(values) !== JSON.stringify(previousValues)) {
            setPreviousValues(values);
            router.get("/", values, {
                preserveState: true,
                replace: true,
            });
        }
    };

    const table = useReactTable({
        data: data.data,
        columns: generateColumns(data.data),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    });

    const handleRowsPerPageChange = (value: string) => {
        setRowsPerPage(parseInt(value, 10));
        setPageIndex(0);
    };

    return (
        <>
            <div className="w-full">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Search..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="max-w-sm focus:border-0"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                <Columns2 /> View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            disabled={makePermanent.includes(
                                                column.id,
                                            )}
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column
                                                            .columnDef.header,
                                                        header.getContext(),
                                                    )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className={"text-center"}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={
                                            generateColumns(data.data).length
                                        }
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s)
                        selected.
                    </div>
                    <div className={"flex items-center gap-5 text-sm"}>
                        <div className={"flex items-center gap-2"}>
                            <p>Rows per page</p>
                            <div>
                                <Select onValueChange={handleRowsPerPageChange}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue
                                            placeholder={String(rowsPerPage)}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="15">
                                                15
                                            </SelectItem>
                                            <SelectItem value="30">
                                                30
                                            </SelectItem>
                                            <SelectItem value="50">
                                                50
                                            </SelectItem>
                                            <SelectItem value="100">
                                                100
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <p>
                            Page {pageIndex + 1} of {table.getPageCount()}
                        </p>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPageIndex(pageIndex - 1)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <ChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPageIndex(pageIndex - 1)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <ChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPageIndex(pageIndex + 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <ChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPageIndex(pageIndex + 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <ChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TableLayout;
