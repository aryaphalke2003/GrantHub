import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { datagrid_style, headerClassName } from "../utils/constants";
import { moneyFormatter, tableParser } from "../utils/table_utils";
import MyTabs from "./inputs/MyTabs";

// template for rows to fill budget data into
const rows_template = [
    { head: "equipment", name: "Equipment", remaining: 0, total: 0, sanction: 0 },
    { head: "consumable", name: "Consumables", remaining: 0, total: 0, sanction: 0 },
    { head: "travel", name: "Travel", remaining: 0, total: 0, sanction: 0 },
    { head: "contingency", name: "Contingency", remaining: 0, total: 0, sanction: 0 },
    { head: "manpower", name: "Manpower", remaining: 0, total: 0, sanction: 0 },
    { head: "overhead", name: "Overhead", remaining: 0, total: 0, sanction: 0 },
    {
        head: "consultancy_amount",
        name: "Consultancy Amount",
        remaining: 0,
        total: 0,
        sanction: 0,
    },
    { head: "others", name: "Others", remaining: 0, total: 0, sanction: 0 },
];

// table of budget for a project
export default function BudgetTable({
    project_id,
    project_type,
    onChange,
    refetch,
}: {
    project_id: string;
    project_type: string;
    onChange?: (newRow: { [key: string]: any }, oldRow: { [key: string]: any }) => void;
    refetch: boolean;
}) {
    const [cookies] = useCookies(["auth_jwt", "user_type"]);
    const [data, setData] = useState<any[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [expenseIDs, setExpenseIDs] = useState<number[]>([]);
    const [currentTab, setCurrentTab] = useState(0);

    // fetch data, transform it into required format
    useEffect(() => {
        (async () => {
            if (project_id === null) {
                setData([]);
                return;
            }

            // default columns
            let cols: GridColDef[] = [
                {
                    field: "name",
                    type: "string",
                    headerName: "Head",
                    flex: 0.5,
                    editable: false,
                    headerClassName,
                },
                {
                    field: "sanction",
                    type: "number",
                    headerName: "Sanctioned",
                    flex: 1,
                    valueFormatter: moneyFormatter,
                    editable: cookies.user_type === "admin",
                    headerClassName,
                },
            ];
            let rows = JSON.parse(JSON.stringify(rows_template));

            // sanctioned amount
            const sanction = (
                await axios.get(`/api/sanction/${project_id}`, {
                    params: { auth: cookies.auth_jwt },
                })
            ).data;

            for (let i = 0; i < rows.length; i++) {
                rows[i].sanction = sanction[rows[i].head];
            }

            // get budget
            const result = await axios.get(`/api/budget/${project_id}`, {
                params: { auth: cookies.auth_jwt },
            });
            const temp = tableParser(result.data);
            // save corresponding expense IDs
            setExpenseIDs(temp.map(r => r.expense_id));

            // fill rows and columns
            for (let i = 0; i < temp.length; i++) {
                for (let j = 0; j < rows.length; j++) {
                    rows[j][`installment_${i + 1}`] = temp[i][rows[j].head];
                    rows[j].total += temp[i][rows[j].head];
                }

                cols.push({
                    field: `installment_${i + 1}`,
                    type: "number",
                    headerName: `Installment ${i + 1}`,
                    flex: 0.7,
                    valueFormatter: moneyFormatter,
                    editable: cookies.user_type === "admin",
                    headerClassName,
                });
            }

            // extra columns
            const remaining_res = await axios.get(`/api/budget/remaining/${project_id}`, {
                params: {
                    auth: cookies.auth_jwt,
                    actual: currentTab === 0 || currentTab === 1,
                    committed: currentTab === 0 || currentTab === 2,
                },
            });

            for (let j = 0; j < rows.length; j++) {
                rows[j].remaining = remaining_res.data[rows[j].head];
            }

            cols.push({
                field: "expenditure",
                type: "number",
                headerName: "Expenditure",
                valueGetter: p => p.row.total - p.row.remaining,
                valueFormatter: moneyFormatter,
                flex: 0.7,
                editable: false,
                headerClassName,
            });

            cols.push({
                field: "remaining",
                type: "number",
                headerName: "Balance",
                valueFormatter: moneyFormatter,
                flex: 0.7,
                editable: false,
                headerClassName,
            });

            if (project_type === "sponsored project")
                rows = rows.filter(r => r.head !== "consultancy_amount");

            // clear data before setting
            setData([]);
            setColumns(cols);
            setData(rows);
        })();
    }, [project_id, project_type, cookies, refetch, currentTab]);

    return (
        <>
            <MyTabs
                tabs={["Actual + Committed", "Actual", "Committed"]}
                panels={[
                    <DataGrid
                        {...datagrid_style}
                        rows={data}
                        getRowId={r => r.head}
                        columns={columns}
                        disableColumnFilter
                        autoHeight
                        components={{ Toolbar: GridToolbar }}
                        experimentalFeatures={{ newEditingApi: true }}
                        processRowUpdate={(newRow, oldRow) => {
                            if (newRow.sanction !== oldRow.sanction) {
                                axios.post(
                                    `/api/update/sanction/${project_id}`,
                                    { head: oldRow.head, amount: newRow.sanction },
                                    { params: { auth: cookies.auth_jwt } }
                                );
                                return oldRow;
                            }
                            const ind = Array(expenseIDs.length)
                                .fill(0)
                                .findIndex(
                                    (_, i) =>
                                        oldRow[`installment_${i + 1}`] !==
                                        newRow[`installment_${i + 1}`]
                                );
                            if (ind === -1) return oldRow;

                            const key = `installment_${ind + 1}`;
                            let split = {};
                            for (let i = 0; i < data.length; i++) {
                                split[data[i].head] = data[i][key];
                            }
                            split[newRow.head] = newRow[key];

                            axios.post(
                                "/api/update/budget",
                                {
                                    expense_id: expenseIDs[ind],
                                    split,
                                },
                                { params: { auth: cookies.auth_jwt } }
                            );

                            if (onChange) onChange(newRow, oldRow);
                            return oldRow;
                        }}
                    />,
                ]}
                onChange={v => setCurrentTab(v)}
                
            />
        </>
    );
}
