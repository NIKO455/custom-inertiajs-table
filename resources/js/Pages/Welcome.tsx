import {Head, usePage} from "@inertiajs/react";
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
    'name',
    'email',
    'status',
    'unique_id',
]


export default function Welcome() {
    const {props} = usePage();
    const dataUser = props.users;
    return (
        <div className={'max-w-7xl m-auto'}>
            <Head title="Welcome"/>
            <div>
                <TableLayout data={dataUser} makePermanent={makePermanent}/>
            </div>
        </div>
    );
}

