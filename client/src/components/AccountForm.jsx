import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { useCookies } from "react-cookie";
import { dept_options, userType_options } from "../utils/constants";
import MySelect from "./inputs/MySelect";
import MyTextField from "./inputs/MyTextField";
import SubmitResetButton from "./inputs/SubmitResetButton";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// form to add a new account
export default function AccountForm({ onSubmit = null }) {
    const initialInfo = {
        email: "",
        type: "",
        dept: "",
        name: "",
    };

    const initialErrors = {
        emailError: "",
        typeError: "",
        deptError: "",
        nameError: "",
    };

    const [open, setOpen] = React.useState(false);

    const [formInfo, setformInfo] = React.useState(initialInfo);

    const [formErrors, setformErrors] = React.useState(initialErrors);

    const [cookies, _, __] = useCookies(["auth_jwt"]);

    const validEmailRegex = RegExp(
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    );

    // reset form
    const handleReset = () => {
        setformInfo(formInfo => initialInfo);
        setformErrors(formErrors => initialErrors);
    };

    // submit form
    function handleSubmit(e) {
        // check errors
        let isEmailError = !validEmailRegex.test(formInfo.email)
            ? "*Enter valid email address."
            : "";
        let isTypeError = formInfo.type.length < 1 ? "*Select user type." : "";
        let isDeptError = formInfo.dept.length < 1 ? "*Select department." : "";
        let isNameError = formInfo.name.length < 1 ? "*Enter valid name." : "";
        setformErrors({
            ...formErrors,
            ...{
                emailError: isEmailError,
                typeError: isTypeError,
                deptError: isDeptError,
                nameError: isNameError,
            },
        });

        if (
            isEmailError.length +
                isTypeError.length +
                isDeptError.length +
                isNameError.length ===
            0
        ) {
            // submit if no errors
            axios.post(
                "/api/add/account",
                { account: formInfo },
                { params: { auth: cookies.auth_jwt } }
            );
            onSubmit && onSubmit();
            setOpen(true);
            handleReset();
        }
    }

    // close form
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    return (
        <div>
            <div className="grid grid-cols-12 gap-x-4 gap-y-8">
                <div className="col-span-12">
                    <MyTextField
                        label="Name"
                        value={formInfo.name}
                        onChange={e => setformInfo(f => ({ ...f, name: e }))}
                        error={formErrors.nameError}
                    />
                </div>
                <div className="col-span-12">
                    <MyTextField
                        label="Email Address"
                        value={formInfo.email}
                        onChange={e => setformInfo(f => ({ ...f, email: e }))}
                        error={formErrors.emailError}
                    />
                </div>
                <div className="col-span-6">
                    <MySelect
                        label="User Type"
                        options={userType_options}
                        getLabel={p => p.label}
                        value={userType_options.find(f => f.value === formInfo.type)}
                        onChange={e => setformInfo(f => ({ ...f, type: e.value }))}
                        error={formErrors.typeError}
                    />
                </div>
                <div className="col-span-6">
                    <MySelect
                        label="Department"
                        options={dept_options}
                        getLabel={p => p.label}
                        value={dept_options.find(d => d.value === formInfo.dept)}
                        onChange={e => setformInfo(f => ({ ...f, dept: e.value }))}
                        error={formErrors.deptError}
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
                    User added successfully!
                </Alert>
            </Snackbar>
        </div>
    );
}
