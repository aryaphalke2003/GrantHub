import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { FormLabel } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import React, { useCallback } from "react";
import { useCookies } from "react-cookie";
import { head_types } from "../utils/constants";
import MyDatePickerTextField from "./inputs/MyDatePickerTextField";
import MyTextField from "./inputs/MyTextField";
import SubmitResetButton from "./inputs/SubmitResetButton";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Form for adding an installment/receipt
export default function InstallmentForm({ project_id, submitCallback }) {
    const initialInfo = {
        particulars: "",
        voucher_no: "",
        date: new Date(),
        head_info: {},
        remarks: "",
    };

    const initialErrors = {
        particulars_error: "",
        voucher_no_error: "",
        date_error: "",
        head_info_error: "",
        remarks_error: "",
    };

    const [open, setOpen] = React.useState(false);

    const [formInfo, setformInfo] = React.useState(initialInfo);

    const [headInfo, setHeadInfo] = React.useState(() => makeInitialHeadInfo());

    const [formErrors, setformErrors] = React.useState(initialErrors);

    const [cookies] = useCookies(["auth_jwt"]);

    // initial head split
    function makeInitialHeadInfo() {
        return head_types.reduce((prev, cur) => {
            prev[cur.value] = "0";
            return prev;
        }, {});
    }

    // on changing head data
    const onHeadChange = useCallback(
        (option, e) => {
            let newHeadInfo = { ...headInfo };
            newHeadInfo[option.value] = e;
            setHeadInfo(newHeadInfo);
            setformInfo({ ...formInfo, ...{ head_info: headInfo } });
        },
        [headInfo, formInfo]
    );

    // reset form
    const handleReset = () => {
        setformInfo(formInfo => initialInfo);
        setformErrors(formErrors => initialErrors);
    };

    // submit
    function handleSubmit(e) {
        // check errors
        let is_particulars_error =
            formInfo.particulars.length < 1 ? "* Enter project particulars." : "";
        let is_voucher_no_error = "";
        let is_date_error = "";
        let is_head_info_error = "";

        for (let x in headInfo) {
            let amount = headInfo[x];
            if (amount < 0) is_head_info_error = "* Enter positive value.";
            if (amount >= 1e14) is_head_info_error = "* Enter a value lesser than 1e14.";
        }
        let is_remarks_error = "";

        setformErrors({
            ...formErrors,
            ...{
                particulars_error: is_particulars_error,
                voucher_no_error: is_voucher_no_error,
                date_error: is_date_error,
                head_info_error: is_head_info_error,
                remarks_error: is_remarks_error,
            },
        });

        // round amounts
        const tempHeadInfo = { ...headInfo };
        for (let index in tempHeadInfo) {
            tempHeadInfo[index] = Math.round(tempHeadInfo[index] * 100) / 100;
        }
        setHeadInfo(tempHeadInfo);
        setformInfo({ ...formInfo, ...{ head_info: headInfo } });

        if (
            is_particulars_error.length +
                is_voucher_no_error.length +
                is_date_error.length +
                is_head_info_error.length +
                is_remarks_error.length ===
            0
        ) {
            // submit if no errors
            axios.post(
                `/api/add/installment/${project_id}`,
                {
                    installment: {
                        particulars: formInfo.particulars,
                        voucher: formInfo.voucher_no,
                        date: formInfo.date,
                        split: Object.keys(headInfo)
                            .map(k => [k, +headInfo[k]])
                            .reduce((prev, cur) => {
                                prev[cur[0]] = cur[1];
                                return prev;
                            }, {}),
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
                <div className="col-span-2">
                    <MyTextField
                        label="Voucher No."
                        value={formInfo.voucher_no}
                        onChange={e => setformInfo(f => ({ ...f, voucher_no: e }))}
                        error={formErrors.vuocher_no_error}
                    />
                </div>
                <div className="col-span-2">
                    <DesktopDatePicker
                        inputFormat="DD/MM/yyy"
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
                <div className="col-span-4">
                    <FormLabel id="amounts-for-all-heads">Amount in Rupees</FormLabel>
                    <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                        {head_types.map(option => (
                            <div className="col-span-1">
                                <MyTextField
                                    label={option.label}
                                    value={headInfo[option.value]}
                                    onChange={e => onHeadChange(option, e)}
                                    type="number"
                                />
                            </div>
                        ))}
                    </div>
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
