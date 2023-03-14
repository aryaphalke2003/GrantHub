import { ReactNode } from "react";
import MyCard from "./MyCard";
import PageContainer from "./PageContainer";
import ProtectedPage from "./ProtectedPage";

// Utility component for a page with a single form
export default function FormPage({
    pageName,
    children,
}: {
    pageName: string;
    children: ReactNode;
}) {
    return (
        <PageContainer pageName={pageName}>
            <ProtectedPage />
            <div className="mx-8 my-6">
                <MyCard>{children}</MyCard>
            </div>
        </PageContainer>
    );
}
