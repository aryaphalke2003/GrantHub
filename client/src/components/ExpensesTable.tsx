import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { datagrid_style, headerClassName, head_types } from "../utils/constants";
import { moneyFormatter, tableParser } from "../utils/table_utils";
import DeleteExpenseDialog from "./DeleteExpenseDialog";
import DeleteToolbar from "./DeleteToolbar";

export type ExpenseRow = {
    expense_id: number;
    project_id: number;
    particulars: string;
    voucher_no: string;
    date: Date;
    receipt: number;
    payment: number;
    head: string;
    remarks: string;
    balance: number;
};

// Expense table columns with optional editability
export const get_expense_columns: (isAdmin: boolean) => GridColDef[] = isAdmin => [
    {
        field: "particulars",
        type: "string",
        headerName: "Particulars",
        flex: 2,
        editable: isAdmin,
        headerClassName,
    },
    {
        field: "remarks",
        type: "string",
        headerName: "Remarks",
        flex: 1.5,
        editable: isAdmin,
        headerClassName,
    },
    {
        field: "voucher_no",
        type: "string",
        headerName: "Voucher No.",
        flex: 0.7,
        editable: isAdmin,
        headerClassName,
    },
    {
        field: "date",
        type: "date",
        headerName: "Date",
        flex: 1,
        editable: isAdmin,
        headerClassName,
        valueGetter: p => (p.value === "-" ? "Committed" : p.value),
    },
    {
        field: "receipt",
        type: "number",
        headerName: "Receipt",
        flex: 0.7,
        valueFormatter: moneyFormatter,
        editable: false,
        headerClassName,
    },
    {
        field: "payment",
        type: "number",
        headerName: "Payment",
        flex: 0.7,
        valueFormatter: moneyFormatter,
        editable: isAdmin,
        headerClassName,
    },
    {
        field: "balance",
        type: "number",
        headerName: "Balance",
        flex: 0.7,
        valueFormatter: moneyFormatter,
        editable: false,
        headerClassName,
    },
    {
        field: "head",
        type: "singleSelect",
        headerName: "Head",
        flex: 1,
        editable: isAdmin,
        valueOptions: head_types,
        headerClassName,
    },
];

export default function ExpensesTable({
    project_id,
    onChange,
    refetch,
}: {
    project_id: string;
    onChange?: (newRow: { [key: string]: any }, oldRow: { [key: string]: any }) => void;
    refetch: boolean;
}) {
    const [cookies] = useCookies(["auth_jwt", "user_type"]);
    const [data, setData] = useState<ExpenseRow[]>([]);
    const [selectedIDs, setSelectedIDs] = useState<GridRowId[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    // callback for deleting an expense
    const deleteExpenseCallback = useCallback(
        (accept: boolean) => {
            if (accept) {
                axios.delete("/api/expenses", {
                    data: { ids: selectedIDs },
                    params: { auth: cookies.auth_jwt },
                });
                setSelectedIDs([]);
            }
            setDialogOpen(false);
            onChange({}, {});
        },
        [selectedIDs, cookies.auth_jwt]
    );

    // fetch expense data
    useEffect(() => {
        if (project_id === null) {
            setData([]);
            return;
        }

        axios
            .get(`/api/expenses/${project_id}`, { params: { auth: cookies.auth_jwt } })
            .then(r => setData(tableParser(r.data)));
    }, [project_id, refetch]);

    return (
        <>
            <DeleteExpenseDialog open={dialogOpen} onClose={deleteExpenseCallback} />
            <DataGrid
                {...datagrid_style}
                rows={data}
                getRowId={r => r.expense_id}
                columns={get_expense_columns(cookies.user_type === "admin")}
                autoHeight
                onSelectionModelChange={selection => setSelectedIDs(selection)}
                selectionModel={selectedIDs}
                checkboxSelection={cookies.user_type === "admin"}
                disableSelectionOnClick
                components={{
                    Toolbar: DeleteToolbar(false, selectedIDs.length > 0, () =>
                        setDialogOpen(true)
                    ),
                }}
                isCellEditable={p => {
                    if (p.colDef.field === "payment") return p.row.payment !== 0;
                    if (p.colDef.field === "head") return p.row.head !== "grant";
                    return true;
                }}
                experimentalFeatures={{ newEditingApi: true }}
                processRowUpdate={(newRow, oldRow) => {
                    // parse date string
                    if (typeof newRow.date === "string") {
                        const [d, m, y] = newRow.date.split("/").map(x => +x);
                        newRow.date = new Date(y, m - 1, d);
                    }
                    // submit updated data
                    axios.post(
                        "/api/update/expense",
                        {
                            expense_id: newRow.expense_id,
                            expense: {
                                project_id: null,
                                particulars: newRow.particulars,
                                date: newRow.date,
                                amount: newRow.payment - newRow.receipt,
                                head: newRow.head,
                                voucher_no: newRow.voucher_no,
                                remarks: newRow.remarks,
                            },
                        },
                        { params: { auth: cookies.auth_jwt } }
                    );

                    if (onChange) onChange(newRow, oldRow);
                    return oldRow;
                }}
            />
        </>
    );
}
