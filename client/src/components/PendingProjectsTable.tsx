import { Close, Done } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { moneyFormatter, tableParser } from "../utils/table_utils";
import useTrigger from "../utils/use_trigger";
import StatusToggle from "./StatusToggle";

// get columns for pending projects, similar to pending expenses
const get_columns: (
    resolve: (id: number, accepted: boolean) => void,
    isAdmin: boolean,
    faculty: string[]
) => GridColDef[] = (resolve, isAdmin, faculty) => {
    const base_rows: GridColDef[] = [
        { field: "name", type: "string", headerName: "Name", flex: 1 },
        { field: "from_date", type: "date", headerName: "From Date", flex: 0.6 },
        { field: "organization", type: "string", headerName: "Organization", flex: 1 },
        {
            field: "total_cost",
            type: "number",
            headerName: "Total Cost",
            flex: 0.6,
            valueFormatter: moneyFormatter,
        },
        { field: "remarks", type: "string", headerName: "Remarks", flex: 1 },
        {
            field: "type",
            type: "string",
            headerName: "Type",
            flex: 0.4,
            valueGetter: p =>
                p.row.type === "sponsored project" ? "Sponsored Project" : "Consulting",
        },
        {
            field: "issuer_email",
            type: "string",
            headerName: "Issuer",
            flex: 0.8,
            valueGetter: p => faculty.find(v => v.includes(p.row.issuer_email)),
        },
        { field: "issue_date", type: "date", headerName: "Request Date", flex: 0.6 },
        {
            field: "status",
            headerName: "Status",
            renderCell: p => <StatusToggle status={p.row.status} />,
            flex: 0.6,
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
                flex: 0.4,
            },
        ];
    return base_rows;
};
export default function PendingProjectsTable() {
    const [data, setData] = useState<any[]>([]);
    const [cookies] = useCookies(["auth_jwt", "user_type"]);
    const [refetchTrigger, toggleRefetchTrigger] = useTrigger();
    const [faculty, setFaculty] = useState<string[]>([]);

    // fetch data
    useEffect(() => {
        axios
            .get("/api/pending/projects", { params: { auth: cookies.auth_jwt } })
            .then(r => setData(tableParser(r.data)));
    }, [cookies.auth_jwt, refetchTrigger]);

    // get faculty
    useEffect(() => {
        axios
            .get("/api/faculty", { params: { auth: cookies.auth_jwt } })
            .then(r => setFaculty(r.data.map(x => `${x.name} (${x.email}) [${x.dept}]`)));
    }, []);

    // resolve pending request
    const resolve = useCallback(
        (id: number, accepted: boolean) => {
            axios.post(
                `/api/update/pending/project/${id}`,
                { accepted },
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
