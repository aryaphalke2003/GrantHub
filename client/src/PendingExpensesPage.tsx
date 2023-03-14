import { Box, Grid } from "@mui/material";
import PageContainer from "./components/PageContainer";
import PendingExpensesTable from "./components/PendingExpensesTable";
import ProtectedPage from "./components/ProtectedPage";

export default function PendingExpensesPage() {
    return (
        <PageContainer pageName="Pending Expenses">
            <ProtectedPage />
            <Box style={{ margin: "2%" }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <PendingExpensesTable />
                    </Grid>
                </Grid>
            </Box>
        </PageContainer>
    );
}
