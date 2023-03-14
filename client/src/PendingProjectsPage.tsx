import { Box, Grid } from "@mui/material";
import PageContainer from "./components/PageContainer";
import PendingProjectsTable from "./components/PendingProjectsTable";
import ProtectedPage from "./components/ProtectedPage";

export default function PendingProjectsPage() {
    return (
        <PageContainer pageName="Pending Projects">
            <ProtectedPage />
            <Box style={{ margin: "2%" }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <PendingProjectsTable />
                    </Grid>
                </Grid>
            </Box>
        </PageContainer>
    );
}
