import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { FormLabel, Paper } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import React, { useCallback, useEffect, useMemo } from "react";
import { useCookies } from "react-cookie";
import { head_types, ProjectType } from "../utils/constants";
import FileUpload from "./FileUpload";
import MyCombobox from "./inputs/Combobox";
import MyDatePickerTextField from "./inputs/MyDatePickerTextField";
import MySelect from "./inputs/MySelect";
import MyTabs from "./inputs/MyTabs";
import MyTextField from "./inputs/MyTextField";
import SubmitResetButton from "./inputs/SubmitResetButton";
import { MyH5 } from "./MyTypography";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Form for adding a project
export default function ProjectForm() {
    const initialInfo = {
        PI: "",
        proj_type: "sponsored project",
        name: "",
        from_date: new Date(),
        organization: "",
        remarks: "",
        file: null,
        expensesStartCell: "",
        expensesEndCell: "",
        budgetStartCell: "",
        budgetEndCell: "",
    };

    const initialErrors = {
        PI_error: "",
        proj_type_error: "",
        name_error: "",
        from_date_error: "",
        organization_error: "",
        remarks_error: "",
        equipment_error: "",
        consumable_error: "",
        contingency_error: "",
        manpower_error: "",
        overhead_error: "",
        consultancy_amount_error: "",
        others_error: "",
        travel_error: "",
        file_error: "",
        expensesStartCell_error: "",
        expensesEndCell_error: "",
        budgetStartCell_error: "",
        budgetEndCell_error: "",
    };

    const [open, setOpen] = React.useState(false);

    const [formInfo, setformInfo] = React.useState(initialInfo);

    const [headInfo, setHeadInfo] = React.useState(() => makeInitialHeadInfo());

    const [PIValues, setPIValues] = React.useState([]);

    const [cookies] = useCookies(["auth_jwt"]);

    const [activeTab, setActiveTab] = React.useState(0);

    // set initial head values
    function makeInitialHeadInfo() {
        return head_types.reduce((prev, cur) => {
            prev[cur.value] = "0";
            return prev;
        }, {});
    }

    // change head amount
    const onHeadChange = useCallback(
        (option, e) => {
            let newHeadInfo = { ...headInfo };
            newHeadInfo[option.value] = e;
            setHeadInfo(newHeadInfo);
        },
        [headInfo]
    );

    // fetch all faculty
    useEffect(() => {
        axios.get("/api/faculty", { params: { auth: cookies.auth_jwt } }).then(r => {
            setPIValues(
                r.data.map(x => ({
                    value: x.email,
                    label: `${x.name} (${x.email}) [${x.dept}]`,
                }))
            );
        });
    }, []);

    // reset form
    const handleReset = useCallback(() => setformInfo(initialInfo), [initialInfo]);

    // calculate errors
    const formErrors = useMemo(() => {
        let new_errors = { ...initialErrors };
        new_errors.PI_error = formInfo.PI.length < 1 ? "* Select PI." : "";
        new_errors.proj_type_error =
            formInfo.proj_type.length < 1 ? "* Select project type." : "";
        new_errors.name_error = formInfo.name.length < 1 ? "* Enter valid name." : "";
        new_errors.organization_error =
            formInfo.organization.length < 1 ? "* Enter valid organization name." : "";
        new_errors.remarks_error = "";

        new_errors.from_date_error =
            formInfo.from_date === null ? "* Enter valid date" : "";
        const getError = val => (val === null || val === "" ? "* Required" : "");
        if (activeTab === 0) {
            head_types.map(
                p =>
                    (new_errors[`${p.value}_error`] =
                        headInfo[p.value] === null
                            ? "* Required"
                            : headInfo[p.value] < 0
                            ? "* Amount cannot be negative"
                            : "")
            );
        } else {
            new_errors = {
                ...new_errors,
                file_error: getError(formInfo.file),
                expensesStartCell_error: getError(formInfo.expensesStartCell),
                expensesEndCell_error: getError(formInfo.expensesEndCell),
                budgetStartCell_error: getError(formInfo.budgetStartCell),
                budgetEndCell_error: getError(formInfo.budgetEndCell),
            };
        }
        return new_errors;
    }, [formInfo, headInfo]);

    // utility function
    const onFieldChange = useCallback(
        (field, value) => {
            setformInfo({ ...formInfo, [field]: value });
        },
        [formInfo, formErrors]
    );

    // submit form
    const handleSubmit = useCallback(
        e => {
            const tempHeadInfo = { ...headInfo };
            for (let index in tempHeadInfo) {
                tempHeadInfo[index] = Math.round(tempHeadInfo[index] * 100) / 100;
            }
            if (formInfo.proj_type === "sponsored project")
                tempHeadInfo["consultancy_amount"] = 0;

            if (Object.values(formErrors).every(p => p.length === 0)) {
                // submit if no erorrs
                // check if submitting sanctions or excel sheet
                if (activeTab === 0)
                    axios.post(
                        "/api/add/project",
                        {
                            project: {
                                name: formInfo.name,
                                pi: formInfo.PI,
                                type: formInfo.proj_type,
                                from: formInfo.from_date,
                                to: null,
                                org: formInfo.organization,
                                remarks: formInfo.remarks,
                                split: Object.keys(tempHeadInfo)
                                    .map(k => [k, +tempHeadInfo[k]])
                                    .reduce((prev, cur) => {
                                        prev[cur[0]] = cur[1];
                                        return prev;
                                    }, {}),
                            },
                        },
                        { params: { auth: cookies.auth_jwt } }
                    );
                else {
                    let form = new FormData();

                    form.set("name", formInfo.name);
                    form.set("fromDate", formInfo.from_date.toString());
                    form.set("faculty", formInfo.PI);
                    form.set("projType", formInfo.proj_type);
                    form.set("org", formInfo.organization);
                    form.set("file", formInfo.file);
                    form.set("expensesStartCell", formInfo.expensesStartCell);
                    form.set("expensesEndCell", formInfo.expensesEndCell);
                    form.set("budgetStartCell", formInfo.budgetStartCell);
                    form.set("budgetEndCell", formInfo.budgetEndCell);

                    axios.post("/api/add/project/excel", form, {
                        params: { auth: cookies.auth_jwt },
                        headers: { "content-type": "multipart/form-data" },
                    });
                }
                setOpen(true);
                handleReset();
            }
        },
        [formInfo, formErrors, headInfo, cookies.auth_jwt]
    );

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    return (
        <div>
            <div className="grid grid-cols-12 gap-x-4 gap-y-8">
                <div className="col-span-6">
                    <MyTextField
                        label="Name"
                        value={formInfo.name}
                        onChange={e => setformInfo({ ...formInfo, name: e })}
                        error={formErrors.name_error}
                    />
                </div>

                <div className="col-span-6">
                    <MyTextField
                        label="Organization"
                        value={formInfo.organization}
                        onChange={e => setformInfo({ ...formInfo, organization: e })}
                        error={formErrors.organization_error}
                    />
                </div>
                <div className="col-span-4">
                    <DesktopDatePicker
                        inputFormat="DD/MM/yyy"
                        value={formInfo.from_date}
                        onChange={e => {
                            setformInfo({ ...formInfo, ...{ ["from_date"]: e } });
                        }}
                        renderInput={params => (
                            <MyDatePickerTextField
                                {...params}
                                label="From Date"
                                errorText={formErrors.from_date_error}
                            />
                        )}
                    />
                </div>

                <div className="col-span-4">
                    <MyCombobox
                        label="PI"
                        value={
                            formInfo.PI === ""
                                ? ""
                                : PIValues.find(p => p.value === formInfo.PI)
                        }
                        onChange={e => setformInfo({ ...formInfo, PI: e.value })}
                        options={PIValues}
                        getLabel={p => p.label}
                        error={formErrors.PI_error}
                    />
                </div>

                <div className="col-span-4">
                    <MySelect
                        label="Project Type"
                        value={ProjectType.find(p => p.value === formInfo.proj_type)}
                        options={ProjectType}
                        onChange={e => setformInfo({ ...formInfo, proj_type: e.value })}
                        getLabel={p => p.label}
                    />
                </div>

                <div className="col-span-12">
                    <MyTabs
                        onChange={setActiveTab}
                        tabs={["Manual Entry", "From Excel File"]}
                        panels={[
                            <>
                                <FormLabel>Sanctioned</FormLabel>
                                <div className="grid grid-cols-4 gap-4">
                                    {head_types.map(option => (
                                        <div>
                                            <MyTextField
                                                label={option.label}
                                                value={headInfo[option.value]}
                                                onChange={e => onHeadChange(option, e)}
                                                disabled={
                                                    option.value ===
                                                        "consultancy_amount" &&
                                                    formInfo.proj_type ===
                                                        "sponsored project"
                                                }
                                                type="number"
                                                error={
                                                    formErrors[`${option.value}_error`]
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>,
                            <div className="grid grid-cols-12 gap-x-2 gap-y-4">
                                <div className="col-span-12">
                                    <FileUpload
                                        value={formInfo.file}
                                        label="Excel File"
                                        onChange={e => onFieldChange("file", e)}
                                        accept=".xls,.xlsx"
                                        error={formErrors.file_error}
                                    />
                                </div>
                                <div className="col-span-6">
                                    <div className="bg-white rounded-md shadow-md grid grid-cols-8 gap-4 p-4 items-center justify-center">
                                        <div className="col-span-2 align-middle">
                                            <MyH5>Expenses Table</MyH5>
                                        </div>
                                        <div className="col-span-3">
                                            <MyTextField
                                                label="Top-Left Cell"
                                                value={formInfo.expensesStartCell}
                                                onChange={e =>
                                                    onFieldChange("expensesStartCell", e)
                                                }
                                                error={formErrors.expensesStartCell_error}
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <MyTextField
                                                label="Bottom-Right Cell"
                                                value={formInfo.expensesEndCell}
                                                onChange={e =>
                                                    onFieldChange("expensesEndCell", e)
                                                }
                                                error={formErrors.expensesEndCell_error}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-6">
                                    <div className="bg-white rounded-md shadow-md grid grid-cols-8 gap-4 p-4 items-center justify-center">
                                        <div className="col-span-2 align-middle">
                                            <MyH5>Budget Table</MyH5>
                                        </div>
                                        <div className="col-span-3">
                                            <MyTextField
                                                label="Top-Left Cell"
                                                value={formInfo.budgetStartCell}
                                                onChange={e =>
                                                    onFieldChange("budgetStartCell", e)
                                                }
                                                error={formErrors.budgetStartCell_error}
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <MyTextField
                                                label="Bottom-Right Cell"
                                                value={formInfo.budgetEndCell}
                                                onChange={e =>
                                                    onFieldChange("budgetEndCell", e)
                                                }
                                                error={formErrors.budgetEndCell_error}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>,
                        ]}
                    />
                </div>

                <div className="col-span-12">
                    <MyTextField
                        label="Remarks"
                        value={formInfo.remarks}
                        onChange={e => setformInfo({ ...formInfo, remarks: e })}
                        error={formErrors.remarks_error}
                    />
                </div>

                <div className="col-span-2">
                    <SubmitResetButton
                        handleSubmit={handleSubmit}
                        handleReset={handleReset}
                    />
                </div>
            </div>

            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
                    Request Sent!
                </Alert>
            </Snackbar>
        </div>
    );
}
