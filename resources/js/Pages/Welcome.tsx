import { Head, usePage } from "@inertiajs/react";
import TableLayout from "@/Pages/Partials/TableLayout";

export type Payment = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
    gmail: string | null;
};

// :%s/<old_word>/<new_word> => this will replace all the matching word and this is not case sensitive
// :%s/\C<old_word>/<new_word> => this will replace only the matching word and this is case sensitive

export const makePermanent = ["name", "email", "status", "unique_id"];

export default function Welcome() {
    const { props } = usePage();
    const dataUser = props.users;

    const actionButtons = {
        edit: true,
        delete: true,
        view: true,
    }

    const actionButtonLinks = {
        edit: '/edit',
        delete: '/delete',
        view: '/view'
    }

    return (
        <div className={"max-w-5xl m-auto"}>
            <Head title="Welcome" />
            <div>
                <TableLayout data={dataUser} makePermanent={makePermanent} actionButtons={actionButtons} actionButtonLinks={actionButtonLinks} tableName={'user'} />
            </div>
        </div>
    );
}
