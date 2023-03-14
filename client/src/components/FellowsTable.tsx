import { Button } from "@mui/material";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { datagrid_style, headerClassName } from "../utils/constants";
import { moneyFormatter, tableParser } from "../utils/table_utils";
import DeleteFellowDialog from "./DeleteFellowDialog";
import DeleteToolbar from "./DeleteToolbar";
import YesNoButton from "./YesNoButon";
import YesNoIcon from "./YesNoIcon";

export interface FellowsRow {
    fellow_id: number;
    type: string;
    monthly_salary: number;
    hostel: boolean;
    hra: number | null;
    name: string;
    project: string;
    from_date: Date;
    to_date: Date;
    last_salary_id: number;
    last_salary_date: Date;
}

// columns for fellows table, optional navigation to project
export const get_columns: (
    isAdmin: boolean,
    navigator: NavigateFunction,
    editCallback: (
        newRow: { [key: string]: string },
        oldRow: { [key: string]: string }
    ) => { [key: string]: string }
) => GridColDef[] = (isAdmin, navigator, editCallback) => [
    {
        field: "name",
        headerName: "Name",
        type: "string",
        flex: 1.5,
        editable: isAdmin,
        headerClassName,
    },
    {
        field: "type",
        headerName: "Type",
        type: "singleSelect",
        valueOptions: [
            { value: "jrf", label: "JRF" },
            { value: "srf", label: "SRF" },
            { value: "ra", label: "RA" },
            { value: "other", label: "Other" },
        ],
        flex: 0.5,
        editable: isAdmin,
        valueFormatter: p => p.value.toString().toUpperCase(),
        headerClassName,
    },
    {
        field: "project",
        headerName: "Project",
        minWidth: 200,
        maxWidth: 300,
        flex: 1,
        renderCell: p => (
            <Button
                variant="outlined"
                onClick={() => navigator(`/project?project_id=${p.row.project_id}`)}
                fullWidth
            >
                {p.row.project}
            </Button>
        ),
        editable: false,
        headerClassName,
    },
    {
        field: "monthly_salary",
        headerName: "Monthly Salary",
        type: "number",
        valueFormatter: moneyFormatter,
        flex: 0.7,
        editable: isAdmin,
        headerClassName,
    },
    {
        field: "hostel",
        headerName: "Hostel",
        renderCell: p =>
            isAdmin ? (
                <YesNoButton
                    accept={p.row.hostel}
                    callback={() =>
                        editCallback({ ...p.row, hostel: !p.row.hostel }, { ...p.row })
                    }
                />
            ) : (
                <YesNoIcon accept={p.row.hostel} />
            ),
        flex: 0.5,
        align: "center",
        headerAlign: "center",
        editable: false,
        headerClassName,
    },
    {
        field: "hra",
        headerName: "HRA",
        type: "number",
        valueFormatter: p => (p.value !== null ? moneyFormatter(p) : "-"),
        flex: 0.7,
        editable: isAdmin,
        headerClassName,
    },
    {
        field: "from_date",
        headerName: "From Date",
        type: "date",
        flex: 0.8,
        editable: isAdmin,
        headerClassName,
    },
    {
        field: "to_date",
        headerName: "To Date",
        type: "date",
        flex: 0.8,
        editable: isAdmin,
        headerClassName,
    },
    {
        field: "last_salary_date",
        headerName: "Last Salary Date",
        type: "date",
        flex: 0.8,
        editable: false,
        headerClassName,
    },
];

// Table for fellows data, optionally for a specific project
export default function FellowsTable({
    project_id,
    showProject = false,
    refetch,
    onChange,
}: {
    project_id?: number | string;
    showProject?: boolean;
    refetch: boolean;
    onChange: () => void;
}) {
    const [cookies] = useCookies(["auth_jwt", "user_type"]);
    const [data, setData] = useState<FellowsRow[]>([]);
    const [selection, setSelection] = useState<GridRowId[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const navigator = useNavigate();

    // fetch data
    useEffect(() => {
        axios
            .get(project_id ? `/api/fellows/${project_id}` : "/api/fellows", {
                params: { auth: cookies.auth_jwt },
            })
            .then(r => setData(tableParser(r.data)));
    }, [cookies.auth_jwt, refetch]);

    // delete fellow
    const deleteCallback = useCallback(
        accept => {
            if (accept) {
                axios.delete("/api/fellows", {
                    params: { auth: cookies.auth_jwt },
                    data: { fellow_ids: selection },
                });
                setSelection([]);
            }
            setDialogOpen(false);
            onChange();
        },
        [cookies.auth_jwt, selection, refetch]
    );

    // edit fellow
    const editCallback = useCallback(
        (newRow, oldRow) => {
            // parse date strings
            if (typeof newRow.from_date === "string") {
                const [d, m, y] = newRow.from_date.split("/").map(x => +x);
                newRow.from_date = new Date(y, m - 1, d);
            }
            if (newRow.to_date === "-") newRow.to_date = null;
            else if (typeof newRow.to_date === "string") {
                const [d, m, y] = newRow.to_date.split("/").map(x => +x);
                newRow.to_date = new Date(y, m - 1, d);
            }
            // submit changes
            axios.post(
                `/api/update/fellow/${oldRow.fellow_id}`,
                {
                    fellow: {
                        type: newRow.type,
                        salary: newRow.monthly_salary,
                        hostel: newRow.hostel,
                        hra: newRow.hra,
                        name: newRow.name,
                        from_date: newRow.from_date,
                        to_date: newRow.to_date,
                    },
                },
                { params: { auth: cookies.auth_jwt } }
            );

            onChange();
            return oldRow;
        },
        [cookies.auth_jwt, refetch]
    );

    return (
        <>
            <DeleteFellowDialog open={dialogOpen} onClose={deleteCallback} />
            <DataGrid
                {...datagrid_style}
                rows={data}
                getRowId={r => r.fellow_id}
                columns={get_columns(
                    cookies.user_type === "admin",
                    navigator,
                    editCallback
                )}
                columnVisibilityModel={{ project: showProject }}
                autoHeight
                components={{
                    Toolbar: DeleteToolbar(true, selection.length > 0, () =>
                        setDialogOpen(true)
                    ),
                }}
                selectionModel={selection}
                onSelectionModelChange={s => setSelection(s)}
                checkboxSelection
                disableSelectionOnClick
                isCellEditable={p => {
                    if (p.colDef.field === "hra") return !p.row.hostel;
                    return true;
                }}
                experimentalFeatures={{ newEditingApi: true }}
                processRowUpdate={editCallback}
            />
        </>
    );
}
