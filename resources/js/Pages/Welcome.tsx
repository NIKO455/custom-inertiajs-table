import {Head} from "@inertiajs/react";
import React from "react";
import TableLayout from "@/Pages/Partials/TableLayout";

export type Payment = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
    gmail: string | null;
};

export const makePermanent = [
    'email',
    'gmail'
]


export default function Welcome({users}: { users: any }) {
    return (
        <div className={'max-w-7xl m-auto'}>
            <Head title="Welcome"/>
            <div>
                <TableLayout data={users} makePermanent={makePermanent}/>
            </div>
        </div>
    );
}

