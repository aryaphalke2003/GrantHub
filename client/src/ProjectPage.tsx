import { Add, Remove } from "@mui/icons-material";
import {
    Collapse,
    Container,
    Grid,
    Paper,
    Stack,
    ToggleButton,
    Typography,
} from "@mui/material";
import { lightBlue } from "@mui/material/colors";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useSearchParams } from "react-router-dom";
import AccessForm from "./components/AccessForm";
import AccessTable from "./components/AccessTable";
import BudgetTable from "./components/BudgetTable";
import ExpenseForm from "./components/ExpenseForm";
import ExpensesTable from "./components/ExpensesTable";
import FellowForm from "./components/FellowForm";
import FellowsTable from "./components/FellowsTable";
import InstallmentForm from "./components/InstallmentForm";
import MyCard from "./components/MyCard";
import PageContainer from "./components/PageContainer";
import ProjectDescription from "./components/ProjectDescription";
import ProtectedPage from "./components/ProtectedPage";
import useTrigger from "./utils/use_trigger";

const TableRenderer = ({ header, form, children }) => {
    const [formOpen, setFormOpen] = useState(false);
    return (
        <Stack direction="column" spacing={3}>
            <div className="relative flex items-center">
                <div className="flex-grow h-0.5 bg-gray-400 mx-6"></div>
                <span className="font-medium font-sans leading-none text-4xl text-gray-900">
                    {header}
                </span>
                <div className="flex-grow h-0.5 bg-gray-400 mx-6"></div>
            </div>
            {form && (
                <MyCard>
                    <ToggleButton
                        value="standalone"
                        selected={formOpen}
                        onChange={() => setFormOpen(!formOpen)}
                        fullWidth
                    >
                        {formOpen ? <Remove /> : <Add />}
                    </ToggleButton>
                    <div className="m-2"></div>
                    <Collapse in={formOpen}>{form}</Collapse>
                </MyCard>
            )}
            {children}
        </Stack>
    );
};

export default function ProjectPage() {
    const [searchParams] = useSearchParams();
    const [cookies] = useCookies(["auth_jwt", "user_type"]);
    const project_id = searchParams.get("project_id");
    const [projectType, setProjectType] = useState("");
    const [refetchTrigger, toggleRefetchTrigger] = useTrigger();
    const [details, setDetails] = useState<any>({});

    useEffect(() => {
        if (project_id === null) return;
        axios
            .get(`/api/grants/${project_id}`, {
                params: { auth: cookies.auth_jwt },
            })
            .then(({ data }) => setDetails(data));
    }, []);

    if (project_id === null)
        return (
            <PageContainer pageName="Project">
                <ProtectedPage />
                <Container>
                    <Paper
                        style={{
                            padding: 2,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        Looks like you haven't selected a project! Select one from{" "}
                        <Link to="/grants">here</Link> to view its overview.
                    </Paper>
                </Container>
            </PageContainer>
        );

    return (
        <PageContainer pageName={`${details.name} (${details.pi_name})`}>
            <ProtectedPage />
            <Stack direction="column" spacing={6} paddingX="5%" paddingY="2%">
                <ProjectDescription
                    project_id={+project_id}
                    typeCallback={v => setProjectType(v)}
                />
                <TableRenderer
                    header="Expenses"
                    form={
                        <ExpenseForm
                            project_id={project_id}
                            project_type={projectType}
                            submitCallback={() => {
                                toggleRefetchTrigger();
                            }}
                        />
                    }
                >
                    <ExpensesTable
                        project_id={project_id}
                        onChange={() => toggleRefetchTrigger()}
                        refetch={refetchTrigger}
                    />
                </TableRenderer>
                <TableRenderer
                    header="Budget"
                    form={
                        <InstallmentForm
                            project_id={project_id}
                            submitCallback={() => {
                                toggleRefetchTrigger();
                            }}
                        />
                    }
                >
                    <BudgetTable
                        project_id={project_id}
                        project_type={projectType}
                        onChange={() => toggleRefetchTrigger()}
                        refetch={refetchTrigger}
                    />
                </TableRenderer>
                <TableRenderer
                    header="Access"
                    form={
                        cookies.user_type === "admin" ? (
                            <AccessForm
                                project_id={project_id}
                                refetch={refetchTrigger}
                                onSubmit={() => toggleRefetchTrigger()}
                            />
                        ) : null
                    }
                >
                    <AccessTable
                        project_id={project_id}
                        refetch={refetchTrigger}
                        onChange={() => toggleRefetchTrigger()}
                    />
                </TableRenderer>
                <TableRenderer
                    header="Fellows"
                    form={
                        <FellowForm
                            project_id={project_id}
                            onSubmit={() => toggleRefetchTrigger()}
                        />
                    }
                >
                    <FellowsTable
                        project_id={project_id}
                        refetch={refetchTrigger}
                        onChange={() => toggleRefetchTrigger()}
                    />
                </TableRenderer>
            </Stack>
        </PageContainer>
    );
}
