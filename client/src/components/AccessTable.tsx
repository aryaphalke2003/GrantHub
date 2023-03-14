import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { datagrid_style, headerClassName } from "../utils/constants";
import { tableParser } from "../utils/table_utils";
import DeleteAccessDialog from "./DeleteAccessDialog";
import DeleteToolbar from "./DeleteToolbar";

export interface AccessRow {
    email: string;
    role: string;
    name: string;
    dept: string;
}

// Columns of access table
const get_columns: (isAdmin: boolean) => GridColDef[] = isAdmin => [
    { field: "name", type: "string", headerName: "Name", flex: 2, headerClassName },
    {
        field: "role",
        type: "singleSelect",
        headerName: "Role",
        flex: 1,
        valueOptions: ["PI", "Co-PI"],
        editable: isAdmin,
        headerClassName,
    },
    { field: "email", type: "string", headerName: "Email", flex: 2, headerClassName },
    { field: "dept", type: "string", headerName: "Department", flex: 1, headerClassName },
];

// Table of faculty with access to a project
export default function AccessTable({
    project_id,
    refetch,
    onChange,
}: {
    project_id: number | string;
    refetch: boolean;
    onChange: () => void;
}) {
    const [cookies] = useCookies(["auth_jwt", "user_type"]);
    const [selected, setSelected] = useState<GridRowId[]>([]);
    const [data, setData] = useState<AccessRow[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    // fetch faculty with access
    useEffect(() => {
        if (project_id === null) {
            setData([]);
            return;
        }

        axios
            .get(`/api/access/${project_id}`, { params: { auth: cookies.auth_jwt } })
            .then(r => setData(tableParser(r.data)));
    }, [cookies.auth_jwt, refetch]);

    // delete faculty with access
    const deleteCallback = useCallback(
        (accept: boolean) => {
            if (accept)
                axios.delete(`/api/access/${project_id}`, {
                    params: { auth: cookies.auth_jwt },
                    data: { emails: selected },
                });
            setSelected([]);
            setDialogOpen(false);
            onChange();
        },
        [selected]
    );

    return (
        <>
            <DeleteAccessDialog open={dialogOpen} onClose={deleteCallback} />
            <DataGrid
                {...datagrid_style}
                rows={data}
                getRowId={r => r.email}
                columns={get_columns(cookies.user_type === "admin")}
                components={{
                    Toolbar: DeleteToolbar(true, selected.length > 0, () =>
                        setDialogOpen(true)
                    ),
                }}
                checkboxSelection={cookies.user_type === "admin"}
                disableSelectionOnClick
                selectionModel={selected}
                onSelectionModelChange={s => setSelected(s)}
                autoHeight
                experimentalFeatures={{ newEditingApi: true }}
                processRowUpdate={(newRow, oldRow) => {
                    axios.post(
                        `/api/update/access/${project_id}`,
                        {
                            email: oldRow.email,
                            role: newRow.role,
                        },
                        { params: { auth: cookies.auth_jwt } }
                    );
                    onChange();

                    return oldRow;
                }}
            />
        </>
    );
}
