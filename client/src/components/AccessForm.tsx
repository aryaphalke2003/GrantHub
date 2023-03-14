import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Faculty } from "../utils/types";
import MyCombobox from "./inputs/Combobox";

// Form for giving faculty access to a project
export default function AccessForm({
    project_id,
    refetch,
    onSubmit,
}: {
    project_id: number | string;
    refetch: boolean;
    onSubmit: () => void;
}) {
    const [cookies] = useCookies(["auth_jwt", "user_type"]);
    const [chosenFaculty, setChosenFaculty] = useState<Faculty | null>(null);
    const [projectFaculty, setProjectFaculty] = useState<string[]>([]);
    const [allFaculty, setAllFaculty] = useState<Faculty[]>([]);

    // fetch all faculty
    useEffect(() => {
        if (cookies.user_type !== "admin") return;
        axios
            .get("/api/faculty", { params: { auth: cookies.auth_jwt } })
            .then(r => setAllFaculty(r.data));
    }, [cookies.auth_jwt]);

    // get faculty with access to this project
    useEffect(() => {
        if (cookies.user_type !== "admin") return;

        axios
            .get(`/api/access/${project_id}`, { params: { auth: cookies.auth_jwt } })
            .then(r => setProjectFaculty(r.data.map(e => e.email)));
    }, [cookies.auth_jwt, refetch]);

    // function to give faculty access
    const grantAccess = useCallback(() => {
        if (chosenFaculty === null) return;

        axios.post(
            `/api/add/access/${project_id}`,
            { email: chosenFaculty.email },
            { params: { auth: cookies.auth_jwt } }
        );

        onSubmit();
    }, [cookies.auth_jwt, project_id, chosenFaculty]);

    return (
        <div className="flex flex-row gap-2 items-center">
            <div className="grow">
                <MyCombobox
                    label="Faculty"
                    options={allFaculty}
                    getLabel={f => (f === null ? "" : `${f.name} (${f.email})`)}
                    value={chosenFaculty}
                    onChange={f => setChosenFaculty(f)}
                />
            </div>
            <div className="grow-0">
                <button
                    type="button"
                    onClick={() => grantAccess()}
                    className="py-2 px-4 text-base font-medium font-sans uppercase text-white bg-blue-500 rounded-lg border-none outline-none max-h-12 align-middle hover:bg-blue-600"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}
