import { Close, Done } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { head_types } from "../utils/constants";
import { moneyFormatter, tableParser } from "../utils/table_utils";
import useTrigger from "../utils/use_trigger";
import StatusToggle from "./StatusToggle";

// Get columns for pending expenses, optional column to accept/reject if admin user
const get_columns: (
    resolve: (id: number, accepted: boolean) => void,
    isAdmin: boolean,
    faculty: string[]
) => GridColDef[] = (resolve, isAdmin, faculty) => {
    const base_rows: GridColDef[] = [
        { field: "name", type: "string", headerName: "Grant", flex: 1.3 },
        {
            field: "particulars",
            type: "string",
            headerName: "Particulars",
            flex: 1.8,
        },
        {
            field: "remarks",
            type: "string",
            headerName: "Remarks",
            flex: 1.3,
        },
        {
            field: "voucher_no",
            type: "string",
            headerName: "Voucher No.",
            flex: 0.6,
            editable: isAdmin,
        },
        { field: "date", type: "date", headerName: "Date", flex: 0.7 },
        {
            field: "amount",
            type: "number",
            headerName: "Amount",
            flex: 0.8,
            valueFormatter: moneyFormatter,
        },
        {
            field: "head",
            type: "singleSelect",
            headerName: "Head",
            flex: 0.8,
            valueOptions: head_types,
        },
        {
            field: "issuer",
            type: "string",
            headerName: "Issuer",
            flex: 1,
            valueGetter: p => faculty.find(v => v.includes(p.row.issuer)),
        },
        { field: "issue_date", type: "date", headerName: "Request Date", flex: 0.7 },
        {
            field: "status",
            headerName: "Status",
            renderCell: p => <StatusToggle status={p.row.status} />,
            flex: 0.8,
        },
    ];
    if (isAdmin)
        return [
            ...base_rows,
            {
                field: "actions",
                headerName: "",
                renderCell: p => {
                    if (isAdmin && p.row.status === "pending") {
                        return (
                            <Stack direction="row">
                                <IconButton
                                    onClick={() => resolve(p.row.pending_id, true)}
                                >
                                    <Done />
                                </IconButton>
                                <IconButton
                                    onClick={() => resolve(p.row.pending_id, false)}
                                >
                                    <Close />
                                </IconButton>
                            </Stack>
                        );
                    } else return <></>;
                },
                flex: 0.6,
                align: "center",
            },
        ];
    return base_rows;
};

// Table for pending expenses
export default function PendingExpensesTable() {
    const [data, setData] = useState<any[]>([]);
    const [cookies] = useCookies(["auth_jwt", "user_type"]);
    const [refetchTrigger, toggleRefetchTrigger] = useTrigger();
    const [faculty, setFaculty] = useState<string[]>([]);

    // fetch data
    useEffect(() => {
        axios
            .get("/api/pending/expenses", { params: { auth: cookies.auth_jwt } })
            .then(r => setData(tableParser(r.data)));
    }, [cookies.auth_jwt, refetchTrigger]);

    // fetch all faculty
    useEffect(() => {
        axios
            .get("/api/faculty", { params: { auth: cookies.auth_jwt } })
            .then(r => setFaculty(r.data.map(x => `${x.name} (${x.email}) [${x.dept}]`)));
    }, []);

    // callback for resolving a pending request
    const resolve = useCallback(
        (id: number, accepted: boolean) => {
            axios.post(
                `/api/update/pending/expense/${id}`,
                {
                    accepted,
                },
                { params: { auth: cookies.auth_jwt } }
            );
            toggleRefetchTrigger();
        },
        [cookies.auth_jwt]
    );

    return (
        <DataGrid
            rows={data}
            columns={get_columns(resolve, cookies.user_type === "admin", faculty)}
            getRowId={r => r.pending_id}
            autoHeight
        />
    );
}
