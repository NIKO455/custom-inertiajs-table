import {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {
    ArrowDown,
    ArrowRightCircle,
    ArrowUp, Ban,
    CheckCircle,
    ChevronsUpDown, CircleEqual,
    Clock,
    EyeOff,
    MoreHorizontal,
    RefreshCw, TimerIcon,
    XCircle
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import {makePermanent, Payment} from "@/Pages/Welcome";

export function getColumns(data: any) {
    return generateColumns(data);
}

const generateColumns = (data: any) => {
    const keys = Object.keys(data[0]);

    const columns: (null | {
        accessorKey: string;
        header: ({column}: { column: any }) => React.JSX.Element;
        cell: ({row}: { row: any }) => any;
    })[] = keys.map((key: string) => {
        if (key === "id") return null;

        return {
            accessorKey: key,
            header: ({column}: { column: any }) => (
                <div className={'flex justify-center'}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className={'w-8'}>
                                <Button variant="ghost"
                                        className="h-full w-full border-1 p-0">
                                    <span className="sr-only">Open menu</span>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                    <ChevronsUpDown/>
                                </Button>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className={'mt-2'}>
                            <DropdownMenuItem
                                onClick={() => column.toggleSorting("asc")}>
                                <ArrowUp/> Asc
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                                <ArrowDown/> Desc
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem disabled={makePermanent.includes(key)}
                                              onClick={() => column.toggleVisibility(false)}>
                                <EyeOff/> Hide
                            </DropdownMenuItem>
                        </DropdownMenuContent>

                    </DropdownMenu>
                </div>
            ),
            cell: ({row}: { row: any }) => {
                const value = row.getValue(key);
                if (key === "amount") {
                    return new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(value);
                }

                if (key === "status") {
                    let color = "";
                    let icon = null;

                    switch(value) {
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
                            icon = <CircleEqual className="size-4 rotate-90" />;
                            break;
                        case "received":
                            color = "text-gray-400";
                            icon = <ArrowRightCircle className="size-4" />;
                            break;
                        case "approved":
                            color = "text-gray-400";
                            icon = <CheckCircle className="size-4" />;
                            break;
                        case "blocked":
                            color = "text-gray-400";
                            icon = <Ban  className="size-4" />;
                            break;
                        case "expired":
                            color = "text-gray-400";
                            icon = <TimerIcon className="size-4" />;
                            break;
                        default:
                            color = "text-gray-400";
                            icon = <XCircle className="size-4" />;
                    }

                    return <span className={`inline-flex items-center rounded px-2 py-0.5 font-medium gap-2`}>
                            <span className={`${color}`}>{icon}</span>
                            {value}
                    </span>;
                }

                return value;
            },
        };
    }).filter(Boolean);

    const selectColumn: ColumnDef<Payment>[] = [
        {
            id: "select",
            header: ({table}) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className={'ml-3'}
                />
            ),
            cell: ({row}) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        }
    ];

    const actionColumn: ColumnDef<Payment>[] = [
        {
            id: "actions",
            enableHiding: false,
            cell: ({row}) => {
                const payment = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
                                Copy payment ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem>View customer</DropdownMenuItem>
                            <DropdownMenuItem>View payment details</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return [...selectColumn, ...columns, ...actionColumn];
};
