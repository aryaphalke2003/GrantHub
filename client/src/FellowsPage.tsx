import FellowsTable from "./components/FellowsTable";
import PageContainer from "./components/PageContainer";
import ProtectedPage from "./components/ProtectedPage";
import useTrigger from "./utils/use_trigger";

// Show all fellows
export default function FellowsPage() {
    const [refetchTrigger, toggleRefetchTrigger] = useTrigger();
    return (
        <PageContainer pageName="Fellows">
            <ProtectedPage />
            <FellowsTable
                showProject
                refetch={refetchTrigger}
                onChange={() => toggleRefetchTrigger()}
            />
        </PageContainer>
    );
}
