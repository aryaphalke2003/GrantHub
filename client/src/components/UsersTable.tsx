import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {
    datagrid_style,
    dept_options,
    headerClassName,
    userType_options,
} from "../utils/constants";
import { tableParser } from "../utils/table_utils";
import DeleteToolbar from "./DeleteToolbar";
import DeleteUserDialog from "./DeleteUserDialog";

// Columns for users table
const columns: GridColDef[] = [
    {
        field: "name",
        type: "string",
        headerName: "Name",
        flex: 1,
        editable: true,
        headerClassName,
    },
    {
        field: "email",
        type: "string",
        headerName: "Email",
        flex: 1,
        editable: true,
        headerClassName,
    },
    {
        field: "type",
        type: "singleSelect",
        headerName: "Type",
        flex: 1,
        editable: true,
        valueOptions: userType_options,
        headerClassName,
    },
    {
        field: "dept",
        type: "singleSelect",
        headerName: "Department",
        flex: 1,
        editable: true,
        valueOptions: dept_options,
        headerClassName,
    },
];

// table with all users
export default function UsersTable({
    refetch,
    onChange,
}: {
    refetch: boolean;
    onChange: () => void;
}) {
    const [data, setData] = useState<any[]>([]);
    const [cookies] = useCookies(["auth_jwt", "user_type", "user_email"]);
    const [selected, setSelected] = useState<GridRowId[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    // fetch data
    useEffect(() => {
        if (cookies.user_type !== "admin") return;

        axios
            .get("/api/accounts", { params: { auth: cookies.auth_jwt } })
            .then(r => setData(tableParser(r.data)));
    }, [cookies.auth_jwt, refetch]);

    // delete user
    const deleteCallback = useCallback(
        (accept: boolean) => {
            if (accept)
                axios.delete("/api/users", {
                    params: { auth: cookies.auth_jwt },
                    data: { emails: selected },
                });
            setSelected([]);
            setDialogOpen(false);
            onChange();
        },
        [cookies.auth_jwt, selected]
    );

    return (
        <>
            <DeleteUserDialog open={dialogOpen} onClose={deleteCallback} />
            <DataGrid
                {...datagrid_style}
                rows={data}
                columns={columns}
                getRowId={r => r.email}
                autoHeight
                experimentalFeatures={{ newEditingApi: true }}
                isCellEditable={p => p.row.email !== cookies.user_email}
                isRowSelectable={p => p.row.email !== cookies.user_email}
                checkboxSelection
                selectionModel={selected}
                onSelectionModelChange={s => setSelected(s)}
                disableSelectionOnClick
                components={{
                    Toolbar: DeleteToolbar(true, selected.length > 0, () =>
                        setDialogOpen(true)
                    ),
                }}
                processRowUpdate={(newRow, oldRow) => {
                    if (cookies.user_email === oldRow.email) return oldRow;

                    axios.post(
                        "/api/update/account",
                        {
                            email: oldRow.email,
                            account: {
                                name: newRow.name,
                                email: newRow.email,
                                type: newRow.type,
                                dept: newRow.dept,
                            },
                        },
                        { params: { auth: cookies.auth_jwt } }
                    );
                    onChange();

                    return oldRow;
                }}
                pageSize={50}
            />
        </>
    );
}
