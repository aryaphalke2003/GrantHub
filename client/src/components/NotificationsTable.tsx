import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { datagrid_style, headerClassName } from "../utils/constants";
import { tableParser } from "../utils/table_utils";

// Columns for notifications table
export const columns: GridColDef[] = [
    {
        field: "synopsis",
        headerName: "Activity",
        type: "string",
        headerClassName,
        flex: 1,
    },
    { field: "date", headerName: "Date", type: "date", headerClassName, flex: 0.3 },
];

export default function NotificationsTable({ refetch }: { refetch: boolean }) {
    const [cookies] = useCookies(["auth_jwt"]);
    const [data, setData] = useState([]);

    // fetch data
    useEffect(() => {
        axios
            .get("/api/notifs", { params: { auth: cookies.auth_jwt } })
            .then(r => setData(tableParser(r.data)));
    }, [cookies, refetch]);

    return (
        <DataGrid
            {...datagrid_style}
            style={{ height: "430px" }}
            rows={data}
            getRowId={r => r.id}
            columns={columns}
            disableColumnFilter
            disableColumnMenu
            disableColumnSelector
            disableDensitySelector
            disableExtendRowFullWidth
            disableSelectionOnClick
        />
    );
}
