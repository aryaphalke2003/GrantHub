import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import React, { useMemo } from "react";
import { useCookies } from "react-cookie";
import { head_types } from "../utils/constants";
import MyDatePickerTextField from "./inputs/MyDatePickerTextField";
import MySelect from "./inputs/MySelect";
import MyTextField from "./inputs/MyTextField";
import SubmitResetButton from "./inputs/SubmitResetButton";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Form for adding an expense
export default function ExpenseForm({ project_id, project_type, submitCallback }) {
    const initialInfo = {
        particulars: "",
        voucher_no: "",
        date: new Date(),
        amount: 0,
        head: "",
        remarks: "",
    };

    const initialErrors = {
        particulars_error: "",
        voucher_no_error: "",
        date_error: "",
        amount_error: "",
        head_error: "",
        remarks_error: "",
    };

    const [open, setOpen] = React.useState(false);

    const [formInfo, setformInfo] = React.useState(initialInfo);

    const [formErrors, setformErrors] = React.useState(initialErrors);

    const [cookies] = useCookies(["auth_jwt"]);

    // get valid heads
    const heads = useMemo(
        () =>
            project_type === "sponsored project"
                ? head_types.filter(h => h.value !== "consultancy_amount")
                : head_types,
        [project_type]
    );

    // reset form
    const handleReset = () => {
        setformInfo(formInfo => initialInfo);
        setformErrors(formErrors => initialErrors);
    };

    // submit form
    function handleSubmit(e) {
        // check errors
        let is_particulars_error =
            formInfo.particulars.length < 1 ? "* Enter project particulars." : "";
        let is_voucher_no_error = "";
        let is_date_error = "";
        let is_amount_error = "";
        if (formInfo.amount <= 0) is_amount_error = "* Enter positive value.";
        if (formInfo.amount >= 1e14)
            is_amount_error = "* Enter a value lesser than 1e14.";
        let is_head_error = formInfo.head.length < 1 ? "* Select head type." : "";
        let is_remarks_error = "";

        setformErrors({
            ...formErrors,
            ...{
                particulars_error: is_particulars_error,
                voucher_no_error: is_voucher_no_error,
                date_error: is_date_error,
                amount_error: is_amount_error,
                head_error: is_head_error,
                remarks_error: is_remarks_error,
            },
        });

        // round off amount
        formInfo.amount = Math.round(formInfo.amount * 100) / 100;

        if (
            is_particulars_error.length +
                is_voucher_no_error.length +
                is_date_error.length +
                is_amount_error.length +
                is_head_error.length +
                is_remarks_error.length ===
            0
        ) {
            // submit if no errors
            axios.post(
                "/api/add/expense",
                {
                    expense: {
                        project_id,
                        particulars: formInfo.particulars,
                        date: formInfo.date.getTime(),
                        amount: formInfo.amount,
                        head: formInfo.head,
                        voucher_no: formInfo.voucher_no,
                        remarks: formInfo.remarks,
                    },
                },
                { params: { auth: cookies.auth_jwt } }
            );
            if (submitCallback) submitCallback();
            setOpen(true);
            handleReset();
        }
    }

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    return (
        <div>
            <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                <div className="col-span-4">
                    <MyTextField
                        label="Particulars"
                        value={formInfo.particulars}
                        onChange={e => setformInfo(f => ({ ...f, particulars: e }))}
                        error={formErrors.particulars_error}
                    />
                </div>
                <div className="col-span-1">
                    <MyTextField
                        label="Voucher No."
                        value={formInfo.voucher_no}
                        onChange={e => setformInfo(f => ({ ...f, voucher_no: e }))}
                        error={formErrors.vuocher_no_error}
                    />
                </div>
                <div className="col-span-1">
                    <DesktopDatePicker
                        label="Date"
                        inputFormat="DD/MM/yyyy"
                        value={formInfo.date}
                        onChange={e => {
                            setformInfo({ ...formInfo, ...{ ["date"]: e } });
                        }}
                        renderInput={params => (
                            <MyDatePickerTextField
                                {...params}
                                label="Date"
                                errorText={formErrors.date_error}
                            />
                        )}
                    />
                </div>
                <div className="col-span-1">
                    <MyTextField
                        label="Amount"
                        value={formInfo.amount}
                        onChange={e => setformInfo(f => ({ ...f, amount: e }))}
                        type="number"
                        error={formErrors.amount_error}
                    />
                </div>
                <div className="col-span-1">
                    <MySelect
                        label="Head"
                        value={heads.find(f => f.value === formInfo.head)}
                        getLabel={f => f.label}
                        options={heads}
                        onChange={e => setformInfo(f => ({ ...f, head: e.value }))}
                        error={formErrors.head_error}
                    />
                    {/* <TextField
                        id="outlined-select-type"
                        name="head"
                        select
                        label="Head"
                        value={formInfo.head}
                        // helperText="Choose head type"
                        fullWidth
                        variant="outlined"
                        required
                        onChange={e => onFieldChange(e)}
                        style={{ marginTop: "10px" }}
                    >
                        {heads.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField> */}
                </div>

                <div className="col-span-4">
                    <MyTextField
                        label="Remarks"
                        value={formInfo.remarks}
                        onChange={e => setformInfo(f => ({ ...f, remarks: e }))}
                        error={formErrors.remarks_error}
                    />
                </div>

                <div className="col-span-1">
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
