import { Box, Button, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowId } from "@mui/x-data-grid";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { CircularProgressWithLabel } from "./components/CircularProgressWithLabel";
import DateRangePicker from "./components/DateRangePicker";
import DeleteProjectDialog from "./components/DeleteProjectDialog";
import DeleteToolbar from "./components/DeleteToolbar";
import MyCombobox from "./components/inputs/Combobox";
import MyTextField from "./components/inputs/MyTextField";
import MyCard from "./components/MyCard";
import { MyH5 } from "./components/MyTypography";
import NotificationsTable from "./components/NotificationsTable";
import PageContainer from "./components/PageContainer";
import PinButton from "./components/PinButton";
import ProtectedPage from "./components/ProtectedPage";
import { datagrid_style, headerClassName } from "./utils/constants";
import { moneyFormatter, tableParser } from "./utils/table_utils";
import { Faculty } from "./utils/types";
import useTrigger from "./utils/use_trigger";

// row from database
export type GrantsRow = {
    pin_id: number | null;
    project_id: number;
    name: string;
    from_date: Date;
    to_date: Date;
    organization: string;
    total_cost: number;
    expenditure: number;
    received: number;
    type: string;
    pi_email: string;
};

// get percentage usage of grant funding
function getPercentage(params: GridRenderCellParams) {
    let total = params.row.received;
    if (!total || total === 0) total = 1;
    let expenditure = params.row.expenditure;
    if (!expenditure) expenditure = 0;
    return (100 * params.row.expenditure) / total;
}

// get columns of table
const get_columns: (
    cb: () => void,
    isAdmin: boolean,
    faculty: { [key: string]: Faculty },
    navigator: NavigateFunction
) => GridColDef[] = (cb, isAdmin, faculty, navigator) => [
    // toggleable pin
    {
        field: "pin",
        headerName: "",
        width: 50,
        renderCell: p => (
            <PinButton
                pinned={p.row.pid !== null}
                endpoint={`/api/togglepin/${p.row.project_id}`}
                callback={cb}
            />
        ),
        sortable: false,
        hideable: false,
        align: "center",
        disableColumnMenu: true,
        disableExport: true,
        headerClassName,
    },
    {
        field: "project_id",
        type: "string",
        headerName: "Ref. No.",
        flex: 0.4,
        editable: false,
        headerClassName,
    },
    {
        field: "name",
        type: "string",
        headerName: "Grant",
        flex: 1.2,
        editable: isAdmin,
        headerClassName,
    },
    // edit email as dropdown
    {
        field: "pi_email",
        type: "singleSelect",
        headerName: "PI",
        flex: 1.5,
        valueOptions: Object.keys(faculty),
        valueFormatter: ({ value }) => {
            if (typeof value === "string" && value in faculty) {
                return `${faculty[value].name} (${faculty[value].email})`;
            }
            return "ERR";
        },
        editable: isAdmin,
        headerClassName,
    },
    {
        field: "from_date",
        type: "date",
        headerName: "Start Date",
        minWidth: 100,
        flex: 0.6,
        editable: isAdmin,
        headerClassName,
    },
    {
        field: "to_date",
        type: "date",
        headerName: "End Date",
        minWidth: 100,
        flex: 0.6,
        editable: isAdmin,
        headerClassName,
    },
    {
        field: "organization",
        type: "string",
        headerName: "Funding Agency",
        flex: 1.3,
        editable: isAdmin,
        headerClassName,
    },
    {
        field: "remarks",
        type: "string",
        headerName: "Remarks",
        flex: 1.3,
        editable: isAdmin,
        headerClassName,
    },
    {
        field: "total_cost",
        type: "number",
        headerName: "Total Cost",
        flex: 0.7,
        valueFormatter: moneyFormatter,
        editable: false,
        headerClassName,
    },
    {
        field: "type",
        type: "singleSelect",
        headerName: "Type",
        flex: 0.6,
        valueOptions: ["Sponsored Project", "Consulting"],
        valueGetter: p =>
            p.value === "sponsored project" ? "Sponsored Project" : "Consulting",
        valueSetter: p => ({
            ...p.row,
            type: p.value.toString().toLowerCase(),
        }),
        editable: isAdmin,
        headerClassName,
    },
    {
        field: "balance",
        type: "number",
        headerName: "Balance",
        valueGetter: p => p.row.received - p.row.expenditure,
        valueFormatter: moneyFormatter,
        flex: 0.6,
        headerClassName,
    },
    {
        field: "used",
        headerName: "Used",
        renderCell: params => (
            <div style={{ justifyContent: "center" }}>
                <CircularProgressWithLabel value={getPercentage(params)} />
            </div>
        ),
        flex: 0.4,
        align: "center",
        headerAlign: "center",
        disableColumnMenu: true,
        disableExport: true,
        headerClassName,
    },
    {
        field: "visit",
        headerName: "",
        renderCell: params => {
            return (
                <div>
                    <Button
                        onClick={() =>
                            navigator(`/project?project_id=${params.row.project_id}`)
                        }
                    >
                        Visit
                    </Button>
                </div>
            );
        },
        align: "center",
        minWidth: 90,
        sortable: false,
        hideable: false,
        disableColumnMenu: true,
        disableExport: true,
        headerClassName,
    },
];

export default function GrantsPage() {
    const [data, setData] = useState<GrantsRow[]>([]);
    const [cookies] = useCookies(["auth_jwt", "user_type"]);
    const [grantNameFilter, setGrantNameFilter] = useState<string>("");
    const [startDateFromFilter, setStartDateFromFilter] = useState<Date | null>(null);
    const [startDateToFilter, setStartDateToFilter] = useState<Date | null>(null);
    const [endDateFromFilter, setEndDateFromFilter] = useState<Date | null>(null);
    const [endDateToFilter, setEndDateToFilter] = useState<Date | null>(null);
    const [orgFilter, setOrgFilter] = useState<string>("");
    const [facultyFilter, setFacultyFilter] = useState<string[]>([]);
    const [refetchTrigger, toggleRefetchTrigger] = useTrigger();
    const [faculty, setFaculty] = useState<{ [key: string]: Faculty }>({});
    const [selectedIDs, setSelectedIDs] = useState<GridRowId[]>([]);
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);

    // get filtered data from filter values
    const filteredData = useMemo(() => {
        if (!data) return [];

        return data.filter(
            e =>
                (grantNameFilter.length === 0 ||
                    e.name.toLowerCase().startsWith(grantNameFilter.toLowerCase())) &&
                (orgFilter.length === 0 ||
                    e.organization.toLowerCase().startsWith(orgFilter.toLowerCase())) &&
                (!startDateFromFilter || e.from_date >= startDateFromFilter) &&
                (!startDateToFilter || e.from_date <= startDateToFilter) &&
                (!endDateFromFilter || e.to_date >= endDateFromFilter) &&
                (!endDateToFilter || e.to_date <= endDateToFilter) &&
                (facultyFilter.length == 0 || facultyFilter.includes(e.pi_email))
        );
    }, [
        data,
        grantNameFilter,
        orgFilter,
        startDateFromFilter,
        startDateToFilter,
        endDateFromFilter,
        endDateToFilter,
        facultyFilter,
    ]);

    // delete a grant
    const deleteEntries = useCallback(() => {
        axios.delete("/api/grants", {
            data: { ids: selectedIDs },
            params: { auth: cookies.auth_jwt },
        });
        toggleRefetchTrigger();
    }, [selectedIDs, cookies.auth_jwt]);

    // delete confirmation dialog callback
    const onDialogClose = useCallback(
        (confirm: boolean) => {
            if (confirm) deleteEntries();
            setSelectedIDs([]);
            setDialogOpen(false);
        },
        [deleteEntries]
    );

    // fetch grants data
    useEffect(() => {
        axios
            .get("/api/grants/", { params: { auth: cookies.auth_jwt } })
            .then(r => setData(tableParser(r.data)));
    }, [cookies, refetchTrigger]);

    // fetch faculty
    useEffect(() => {
        axios.get("/api/faculty", { params: { auth: cookies.auth_jwt } }).then(r =>
            setFaculty(
                r.data.reduce((prev, cur) => {
                    prev[cur.email] = cur;
                    return prev;
                }, {})
            )
        );
    }, []);

    return (
        <PageContainer pageName="Grants">
            <ProtectedPage />
            <DeleteProjectDialog open={dialogOpen} onClose={onDialogClose} />
            <Box style={{ margin: "1% 2%" }}>
                <Grid container spacing={3} alignItems="stretch">
                    <Grid item xs={5}>
                        <MyCard>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <MyH5>Search Options</MyH5>
                                </div>
                                <div className="w-full">
                                    <MyTextField
                                        label="Grant Name"
                                        value={grantNameFilter}
                                        onChange={e => setGrantNameFilter(e)}
                                    />
                                </div>
                                <div className="w-full">
                                    <MyTextField
                                        label="Funding Agency"
                                        value={orgFilter}
                                        onChange={e => setOrgFilter(e)}
                                    />
                                </div>
                                <div className="w-full">
                                    <DateRangePicker
                                        tooltip="Select all grants with start date in this range"
                                        title="Start Date"
                                        fromDate={startDateFromFilter}
                                        toDate={startDateToFilter}
                                        setFromDate={setStartDateFromFilter}
                                        setToDate={setStartDateToFilter}
                                    />
                                </div>
                                <div className="w-full">
                                    <DateRangePicker
                                        tooltip="Select all grants with end date in this range"
                                        title="End Date"
                                        fromDate={endDateFromFilter}
                                        toDate={endDateToFilter}
                                        setFromDate={setEndDateFromFilter}
                                        setToDate={setEndDateToFilter}
                                    />
                                </div>
                                <div className="w-full col-span-2">
                                    <MyCombobox
                                        label="PI"
                                        options={Object.keys(faculty)}
                                        getLabel={f =>
                                            `${faculty[f].name} (${faculty[f].email})`
                                        }
                                        value={facultyFilter}
                                        onChange={v => setFacultyFilter(v)}
                                        multiple
                                    />
                                </div>
                            </div>
                        </MyCard>
                    </Grid>
                    <Grid item xs={7}>
                        <MyCard>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <MyH5>Notifications</MyH5>
                                </div>
                                <div className="col-span-2">
                                    <NotificationsTable refetch={refetchTrigger} />
                                </div>
                            </div>
                        </MyCard>
                    </Grid>
                    <Grid item xs={12}>
                        <DataGrid
                            {...datagrid_style}
                            style={{ height: "600px" }}
                            rows={filteredData}
                            getRowId={r => r.project_id}
                            columns={get_columns(
                                () => toggleRefetchTrigger(),
                                cookies.user_type === "admin",
                                faculty,
                                navigate
                            )}
                            disableColumnFilter
                            onSelectionModelChange={selection =>
                                setSelectedIDs(selection)
                            }
                            selectionModel={selectedIDs}
                            components={{
                                Toolbar: DeleteToolbar(
                                    false,
                                    selectedIDs.length > 0,
                                    () => setDialogOpen(true)
                                ),
                            }}
                            checkboxSelection={cookies.user_type === "admin"}
                            disableSelectionOnClick
                            experimentalFeatures={{ newEditingApi: true }}
                            processRowUpdate={(newRow, oldRow) => {
                                axios.post(
                                    `/api/update/project/${oldRow.project_id}`,
                                    {
                                        project: {
                                            name: newRow.name,
                                            type: newRow.type,
                                            pi: newRow.pi_email,
                                            from: newRow.from_date,
                                            to:
                                                newRow.to_date === "-"
                                                    ? null
                                                    : newRow.to_date,
                                            org: newRow.organization,
                                            split: {},
                                            remarks: newRow.remarks,
                                        },
                                    },
                                    { params: { auth: cookies.auth_jwt } }
                                );
                                toggleRefetchTrigger();
                                return oldRow;
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </PageContainer>
    );
}
