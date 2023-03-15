import { Add, Remove } from "@mui/icons-material";
import { Collapse, Container, Grid, Paper, ToggleButton } from "@mui/material";
import { lightBlue } from "@mui/material/colors";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";
import AccountForm from "./components/AccountForm";
import MyCard from "./components/MyCard";
import PageContainer from "./components/PageContainer";
import ProtectedPage from "./components/ProtectedPage";
import UsersTable from "./components/UsersTable";
import useTrigger from "./utils/use_trigger";

export default function UsersPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [refetchTrigger, toggleRefetchTrigger] = useTrigger();
    const [cookies] = useCookies(["user_type"]);

    if (cookies.user_type !== "admin") return <Navigate to="/grants" />;

    return (
        <PageContainer pageName="Users">
            <ProtectedPage />
            <div className="flex flex-col gap-4 mx-8 my-6">
                <UsersTable
                    refetch={refetchTrigger}
                    onChange={() => toggleRefetchTrigger()}
                />

                <MyCard>
                    <ToggleButton
                        value="standalone"
                        selected={isOpen}
                        onChange={() => setIsOpen(!isOpen)}
                        fullWidth
                    >
                        {isOpen ? <Remove /> : <Add />}
                    </ToggleButton>
                    <div className="m-2"></div>
                    <Collapse in={isOpen}>
                        <AccountForm onSubmit={() => toggleRefetchTrigger()} />
                    </Collapse>
                </MyCard>
                
            </div>
            
        </PageContainer>
    );
}
