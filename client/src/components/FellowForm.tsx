import { DesktopDatePicker } from "@mui/lab";
import axios from "axios";
import { useCallback, useState } from "react";
import { useCookies } from "react-cookie";
import MyCheckbox from "./inputs/MyCheckbox";
import MyDatePickerTextField from "./inputs/MyDatePickerTextField";
import MySelect from "./inputs/MySelect";
import MyTextField from "./inputs/MyTextField";
import SubmitResetButton from "./inputs/SubmitResetButton";

// Form for adding a new fellow to a project
export default function FellowForm({
    project_id,
    onSubmit,
}: {
    project_id: string | number;
    onSubmit: () => void;
}) {
    const initialFormInfo = {
        name: "",
        type: "srf",
        salary: 0,
        hostel: false,
        hra: 0,
        from_date: new Date(),
        to_date: new Date(),
    };

    const initialFormErrors = {
        name: "",
        salary: "",
        from_date: "",
        to_date: "",
    };

    const [formInfo, setFormInfo] = useState(initialFormInfo);
    const [formErrors, setFormErrors] = useState(initialFormErrors);
    const [cookies] = useCookies(["auth_jwt"]);

    // utility function
    const setField = (name: string) => value =>
        setFormInfo(f => ({ ...f, [name]: value }));

    // reset form
    const reset = () => {
        setFormInfo(initialFormInfo);
        setFormErrors(initialFormErrors);
    };

    // submit form
    const submit = useCallback(() => {
        function checkError(name: string) {
            if (formInfo[name] === null || formInfo[name] === "") {
                setFormErrors(f => ({ ...f, [name]: "* Required" }));
                return false;
            } else {
                setFormErrors(f => ({ ...f, [name]: "" }));
                return true;
            }
        }
        // check errors
        if (
            checkError("name") &&
            checkError("salary") &&
            checkError("from_date") &&
            checkError("to_date")
        ) {
            // submit if no errors
            axios.post(
                `/api/add/fellow/${project_id}`,
                { fellow: { ...formInfo } },
                { params: { auth: cookies.auth_jwt } }
            );
            onSubmit();
            reset();
        }
    }, [formInfo, formErrors, cookies]);

    return (
        <div className="grid grid-cols-12 gap-x-4 gap-y-8">
            <div className="col-span-4">
                <MyTextField
                    label="Name"
                    value={formInfo.name}
                    onChange={setField("name")}
                    spellcheck={false}
                    error={formErrors.name}
                />
            </div>
            <div className="col-span-4">
                <MySelect
                    label="Type"
                    options={["srf", "jrf", "ra", "other"]}
                    getLabel={v => v.toString().toUpperCase()}
                    value={formInfo.type}
                    onChange={setField("type")}
                />
            </div>
            <div className="col-span-4">
                <MyTextField
                    label="Salary"
                    value={formInfo.salary}
                    onChange={setField("salary")}
                    type="number"
                    error={formErrors.salary}
                />
            </div>
            <div className="col-span-3">
                <DesktopDatePicker
                    inputFormat="DD/MM/yyyy"
                    value={formInfo.from_date}
                    onChange={setField("from_date")}
                    renderInput={params => (
                        <MyDatePickerTextField
                            {...params}
                            label="From Date"
                            errorText={formErrors.from_date}
                        />
                    )}
                />
            </div>
            <div className="col-span-3">
                <DesktopDatePicker
                    inputFormat="DD/MM/yyyy"
                    value={formInfo.to_date}
                    onChange={setField("to_date")}
                    renderInput={params => (
                        <MyDatePickerTextField
                            {...params}
                            label="To Date"
                            errorText={formErrors.to_date}
                        />
                    )}
                />
            </div>
            <div className="col-span-3">
                <MyCheckbox
                    label="Hostel"
                    value={formInfo.hostel}
                    onChange={setField("hostel")}
                />
            </div>
            <div className="col-span-3">
                <MyTextField
                    label="HRA"
                    value={formInfo.hra}
                    onChange={setField("hra")}
                    type="number"
                    disabled={formInfo.hostel}
                />
            </div>
            <div className="col-span-3">
                <SubmitResetButton handleReset={reset} handleSubmit={submit} />
            </div>
        </div>
    );
}
